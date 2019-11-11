import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import useForm from "react-hook-form";
import { parse } from "date-fns";
import { UPDATE_USER, GET_USER } from "../util";
import { User } from "../types";
import { ExecutionResult } from "graphql";
import { parseISO, format } from "date-fns/esm";
type Props = {
  userId: number;
  currentUserId: number;
  updateCurrentUser: (arg0: User) => void;
  setDisplay: (arg0: boolean) => void;
};

const UpdateUser: React.FC<Props> = ({
  userId,
  currentUserId,
  updateCurrentUser,
  setDisplay,
}) => {
  // console.warn({ user });
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const { handleSubmit, register, errors } = useForm();
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
  });
  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-6 rounded-lg shadow-xl">Loading....</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 bg-red-200  rounded-lg shadow-xl text-red-900">
        Error: {JSON.stringify(error)}
      </div>
    );
  }
  const user: User = data.getUser;
  const onSubmit = async (values: any) => {
    const dob = format(
      parse(values.dob, "MM/dd/yyyy", new Date()),
      "yyyy-MM-dd HH:mm:ss"
    );
    const payload = {
      ...values,
      id: user.id,
      dob,
      currentHeight: Number(values.currentHeight),
      currentWeight: Number(values.currentWeight),
    };
    try {
      const result: ExecutionResult<{
        updateUser: User;
      }> = await updateUserMutation({
        variables: payload,
      });
      if (currentUserId === user.id && result.data) {
        updateCurrentUser({ ...result.data.updateUser });
      }
      setDisplay(false);
    } catch (err) {
      setDisplay(false);
      console.warn({ err });
    }
  };
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
                  defaultValue={format(parseISO(user.dob), "MM/dd/yyyy")}
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
                  Weight (kg)
                </label>
                <input
                  name="currentWeight"
                  ref={register({
                    required: "Required",
                    pattern: {
                      value: /^[1-9][0-9]+[.]?[0-9]?$/i,
                      message: "Example 0.0 (decimal and tenths optional)",
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
                  Height (cm)
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
              onClick={() => setDisplay(false)}
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
