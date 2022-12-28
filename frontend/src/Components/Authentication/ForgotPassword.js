import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const ForgotPassword = ({ data, disableForgotPassword }) => {
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [CPassword, setCPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeVisible, setCodeVisible] = useState(true);
  const [showP, setShowP] = useState(false);
  const [showCP, setShowCP] = useState(false);
  const config = { headers: {
    "Content-type": "application/json",
  },
};
  const submitCode = async () => {
    console.log(data)
    const dataa = await axios.post("/api/user/resetcode",{_id: data._id, code}, config)
    console.log(dataa)
    if (dataa.status === 200) {
        setCodeVisible(false)
    }
  }
  const submitPassword = async () => {
    if (password !== CPassword) {
        toast({
            title: "Passwords do not match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
    } else {
        const dataa = await axios.post("/api/user/updatepassword", {_id: data._id, password: password}, config)
        console.log(dataa)
    }
  }
  return (
    <VStack width="100%">
      {codeVisible && (
        <div>
          <FormControl isRequired>
            <FormLabel>
              Please enter the password reset code sent to your email
            </FormLabel>
            <Input
              value={code}
              type="text"
              placeholder="Enter Code"
              onChange={(e) => setCode(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 12 }}
            onClick={() => submitCode()}
          >
            Submit
          </Button>
        </div>
      )}
      {!codeVisible && (
        <div>
          {/* password field */}
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showP ? "text" : "password"}
                placeholder="Enter password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowP(!showP)}>
                  {showP ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {/* confirm password field */}
          <FormControl style={{ marginTop: 18 }} isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                value={CPassword}
                onChange={(e) => setCPassword(e.target.value)}
                type={showCP ? "text" : "password"}
                placeholder="Enter password"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowCP(!showCP)}
                >
                  {showCP ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 12 }}
            onClick={() => submitPassword()}
          >
            Confirm
          </Button>
        </div>
      )}
    </VStack>
  );
};

export default ForgotPassword;
