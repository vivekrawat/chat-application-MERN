import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect } from 'react'


function Chatpage() {
    const ENDPOINT = "http://localhost:5000";
    const fetchChat = async () => {
        const chat = await axios.get(`${ENDPOINT}/api/chat`)
        console.log(chat)
    }
    useEffect(()=> {
        fetchChat()
    },[])
    return (
      <div className="Homepage">
        <Button colorScheme='blue'>this is a button</Button>
      </div>
    );
  }
  
  
export default Chatpage;