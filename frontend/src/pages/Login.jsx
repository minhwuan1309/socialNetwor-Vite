import { useState } from "react"
import { Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submitHandler = (e) =>{
    e.preventDefault()
    console.log(email, password)
  }

  return (
    <div className="flex justify-center">
      <div
        className="flex flex-col justify-center items-center md:flex-row shadow-md
      rounded-xl max-w-7xl w-[90%] md:[50%] md:mt-[40px]"
      >
        <div className="w-full md:w-3/4">
          <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0 py-4">
            <h1 className="font-semibold text-xl md:text-3xl text-gray-600 m-2">
              Register to Social Media
            </h1>
          </div>

          <form onSubmit={submitHandler}>
            <div className="flex flex-col justify-center items-center m-2 space-y-6 md:space-y-8">
              <input
                type="text"
                className="custom-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="text"
                className="custom-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
            </div>

            <div className="text-center mt-7">
              <button className="auth-btn">Login</button>
            </div>
          </form>
        </div>
        <div className="h-[100%] w-full md:w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 items-center justify-center flex">
          <div className="text-white text-base font-semibold text-center my-10 space-y-2 m-2">
            <h1 className="text-5xl">Don't Have Account?</h1>
            <h1>Register to Social Media</h1>
            <Link
              to="/register"
              className="bg-white rounded-2xl px-4 text-emerald-400"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login