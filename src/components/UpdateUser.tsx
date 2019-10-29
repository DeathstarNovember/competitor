import React from "react";
import { useMutation } from "@apollo/react-hooks";
import useForm from "react-hook-form";
import { parse, format, parseISO } from "date-fns";
import { UPDATE_USER } from "../util";
import { User } from "../types";
import { navigate } from "@reach/router";
type Props = {
  user: User;
  path: string;
};
const UpdateUser: React.FC<Props> = ({ user }) => {
  console.warn({ user });
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = async (values: any) => {
    const dob = parse(values.dob, "MM/dd/yyyy", new Date());
    const payload = {
      id: user.id,
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      dob,
      email: values.email,
      bioSex: values.bioSex,
      currentWeight: Number(values.currentWeight),
      currentHeight: Number(values.currentHeight),
      warCry: values.warCry,
    };
    try {
      const result = await updateUserMutation({
        variables: payload,
      });
      navigate("/");
      console.warn({ result });
    } catch (err) {
      console.warn({ err });
    }
  };
  // console.warn({ errors });
  return (
    <div className={"max-w-md mx-auto p-6"}>
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 py-8 pt-8"
        >
          <div className="flex flex-col flex-1 items-center">
            <div className="pb-4 flex flex-1 items-center">
              <div className="pr-2">
                {/* <label
                  htmlFor="firstName"
                  className="text-sm block font-bold pb-2"
                >
                  First Name
                </label> */}
                <input
                  name="firstName"
                  ref={register({
                    required: "Required",
                  })}
                  defaultValue={user.firstName}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="First Name"
                />
                {errors.firstName && errors.firstName.message}
              </div>
            </div>
            <div className="pb-4 flex flex-1 items-center">
              <div className="pr-2">
                {/* <label
                  htmlFor="lastName"
                  className="text-sm block font-bold pb-2"
                >
                  Last Name
                </label> */}
                <input
                  name="lastName"
                  ref={register({
                    required: "Required",
                  })}
                  defaultValue={user.lastName}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="Last Name"
                />
                {errors.lastName && errors.lastName.message}
              </div>
            </div>
            <div className="pb-4 flex flex-1 items-center">
              <div className="pr-2">
                {/* <label
                  htmlFor="username"
                  className="text-sm block font-bold pb-2"
                >
                  Username
                </label> */}
                <input
                  name="username"
                  ref={register({
                    required: "Required",
                  })}
                  defaultValue={user.username}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="Username"
                />
                {errors.username && errors.username.message}
              </div>
            </div>
            <div className="pb-4 flex flex-1 items-center">
              <div className="pr-2">
                {/* <label htmlFor="email" className="text-sm block font-bold pb-2">
                  Email
                </label> */}
                <input
                  name="email"
                  ref={register({
                    required: "Required",
                  })}
                  defaultValue={user.email}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="Email"
                />
                {errors.email && errors.email.message}
              </div>
            </div>
            <div className="pb-4 flex flex-1 items-center">
              <div className="pr-2">
                <label htmlFor="dob" className="text-sm block font-bold pb-2">
                  Birthdate
                </label>
                <input
                  name="dob"
                  ref={register({
                    required: "Required",
                    pattern: {
                      value: /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/i,
                      message: "MM/DD/YYYY PLS",
                    },
                  })}
                  defaultValue={format(
                    parseISO(String(user.dob)),
                    "MM/dd/yyyy"
                  )}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                  placeholder="MM/DD/YYYY"
                />
              </div>
            </div>
            <div className="pb-4 flex flex-1 items-center">
              <div className="pr-2">
                <label
                  htmlFor="currentWeight"
                  className="text-sm block font-bold pb-2"
                >
                  Weight
                </label>
                <input
                  name="currentWeight"
                  ref={register({
                    required: "Required",
                    pattern: {
                      value: /^[1-9][0-9]+[.][0-9]$/i,
                      message: "Example 0.0 (decimal and tenths required)",
                    },
                  })}
                  defaultValue={String(user.currentWeight)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="kg"
                />
                {errors.currentWeight && errors.currentWeight.message}
              </div>
              <div className="pr-2">
                <label
                  htmlFor="currentHeight"
                  className="text-sm block font-bold pb-2"
                >
                  Height
                </label>
                <input
                  name="currentHeight"
                  ref={register({
                    required: "Required",
                    pattern: {
                      value: /^[1-9][0-9]+$/i,
                      message: "Numbers only PLS",
                    },
                  })}
                  defaultValue={String(user.currentHeight)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="cm"
                />
                {errors.currentHeight && errors.currentHeight.message}
              </div>
            </div>
            <div className="pb-4 flex flex-1 items-center">
              <div className="flex-1 pr-2">
                <label
                  htmlFor="warCry"
                  className="text-sm block font-bold pb-2"
                >
                  War Cry
                </label>
                <input
                  name="warCry"
                  ref={register({
                    required: "Required",
                  })}
                  defaultValue={user.warCry}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="Victory!"
                />
                {errors.warCry && errors.warCry.message}
              </div>
              <div className="flex-1 pr-2">
                <label
                  htmlFor="bioSex"
                  className="text-sm block font-bold pb-2"
                >
                  Biology
                </label>
                <select
                  name="bioSex"
                  ref={register({
                    required: "Required",
                  })}
                  defaultValue={user.bioSex}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                  placeholder="Biology"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
                {errors.bioSex && errors.bioSex.message}
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => navigate("/")}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
