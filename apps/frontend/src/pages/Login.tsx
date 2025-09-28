import axios from "axios";
import  { useState } from "react";

const Login = () => {

  const [email, setEmail ] = useState("")
  const [password , setPasseword] = useState("")
  return (
    <div className="h-[100vw] p-2 ">
      <div className=" min-h-screen p-2 flex justify-center items-center ">
        <div className="border-1 rounded-lg  p-2  h-[40vh] flex flex-col bg-neutral-50">
          <div className="py-2">
            <h1>Welcome Back..</h1>
            <h1 className="">Please SignIn to your Account</h1>
          </div>

          <div className="flex flex-col mx-3  items-start ">
            <label className="p-1"> Email</label>
            <input
              className="bg-neutral-200 p-2 rounded-lg "
              type="text"
              placeholder="Enter your email"
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mx-3 items-start ">
            <label className="p-1"> Password</label>
            <input
              type="text"
              className="bg-neutral-200 p-2 rounded-lg"
              placeholder="Enter the password"
              onChange={(e) => setPasseword(e.target.value)}
            />
          </div>
          <div>
            <button className=" m-5 px-10 py-2 bg-green-200 rounded-lg "
              onClick={async () => {
                const res = await axios.post('http://localhost:8888/api/v1/auth/signin', {
                  email,
                  password
                },
                {
                  withCredentials: true
                }
              )
              console.log(res.data);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
