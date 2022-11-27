import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from 'react-dom'
import { useWeb3React } from "@web3-react/core"
import styled from 'styled-components'
import { Theme } from "../theme"
import {SmallText, BigText, NormalText, Title, MainRow, SubTitle} from "../component-styles"


interface DiscordRoleProps {
    onClose: ()=>void,
}

const vemultidiscordapi = {
    //'1':'http://localhost:8081',
    static:'https://vemultidiscordapi.herokuapp.com',
    env:process.env.prodapi
}

const discordauthurl = {
    1:'https://discord.com/api/oauth2/authorize?client_id=1018299383286075405&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token&scope=identify',
    0:"https://discord.com/api/oauth2/authorize?client_id=1018299383286075405&redirect_uri=https%3A%2F%2Fmultidao.netlify.app%2F&response_type=token&scope=identify"
}

const PopUp = styled.div`
  position: fixed;
  margin: 35vh 25vw;
  width: 50vw;
  padding: 0 10px;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.colors.secondary};
  z-index: 1000;

  @media (max-width: 700px) {
    width: 90%;
    margin: 35vh 5%;
    padding: 0;
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
`


const Ok = styled.div`
  display: inline-block;
  width: 8vh;
  height: 4vh;
  margin: 1vh 80%;
  padding: 0 10px;

 

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 0.08rem;
  text-align: center;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }
  
  @media (max-width: 700px) {
    width: 98%;
    margin: 2px 1%;
    padding: 0;
  }
`



const DiscordRole:React.FC<DiscordRoleProps> =  ({onClose}) => {

    const { provider, chainId, accounts, isActive } = useWeb3React()

    let window: any

    const [discordUser, setDiscordUser] = useState<string>();
    const [status, setStatus] = useState<string>("")

    const overlay = useRef<HTMLDivElement>(null);
    const modal = useRef<HTMLDivElement>(null);

    const exitModal = useCallback((e: { target: any; }) => {
        if(overlay?.current?.contains(e.target) && !modal?.current?.contains(e.target)) {
          onClose();
        }
    },[onClose])
    
    useEffect(() => {
        document.addEventListener("mousedown", exitModal);
        
        return () => {
            document.removeEventListener("mousedown", exitModal);
        }
    }, [exitModal]);

    useEffect(() => {
        const fetchToken = async() => {
            await discord_codefortoken()
        }
        fetchToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const discord_codefortoken = async () => {
        console.log(window.location.hash)
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')]

        const fetchUsers = () => {
            fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`,
            },
            })
            .then(result => result.json())
            .then(response => {
            // response format 
            /*
            {
                    "id": "<user_id>",
                    "username": "Poopeye",
                    "avatar": "3118e64af30fc703b9bf3328d156155c",
                    ...
                }
            */
            // user as avatar URL: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            setDiscordUser(response);
            })
            .catch(console.error)
        }

        if (accessToken) {
            fetchUsers();
        }

    }
  

    const verifyOwnerGeneric = async (_discorduser: string):Promise<any> => {

        if (window.ethereum && provider && accounts && isActive && chainId === 137) {
            try {
                const signedmsg = await window.ethereum.request({
                method: "personal_sign",
                params: ['verify vemulti SBT', accounts[0]],
                })
                return {
                    success: true,
                    status:
                        `✔️ Verified Account Ownership`
                        ,
                    mes:signedmsg,
                    _discorduser:_discorduser
                }
            } catch (error: any) {
                return {
                    success: false,
                    status: "😥 Something went wrong: " + error.message,
                }
            }
        }
        return(undefined)
    }

    const onVerifyPressed = async () => {
    
        if (discordUser){
            const { success, status,mes,_discorduser } = await verifyOwnerGeneric(discordUser)
            setStatus(status);
        
            console.log(success, status,mes,_discorduser)
            if (success && _discorduser) {
                setStatus('granting role...')
            
                const redirecturl= `${vemultidiscordapi.static}/discordrole?&mes=${mes}&user=${_discorduser.id}`
                console.log( redirecturl)
                const res=await fetch(redirecturl)
                console.log(res.status)
                setStatus('You are now a Multi-Citizen with enhanced Discord rights!')
            }
        }
    }
      

    return ReactDOM.createPortal(
        <>
        <Overlay ref={overlay}>
            <PopUp ref={modal} theme = {Theme}>
            <SubTitle theme = {Theme}>MultiCitizen Discord Verification</SubTitle>
                {<br></br>}
                {discordUser?'':<NormalText theme = {Theme} >You are not connected to discord. Please use this link to connect:</NormalText> }
                {<br></br>}
                {discordUser?'':<a  href={discordauthurl[0]}  target="_blank" rel="noreferrer">Connect Discord</a>}
            
              <Ok onClick={() => onClose()} theme = {Theme}>
                OK
              </Ok>
            </PopUp>
        </Overlay>
        </> ,
        document.getElementById("discordRole")!
    )
}

export default DiscordRole