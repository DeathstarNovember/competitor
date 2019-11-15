import React from "react";
import { useMutation } from "@apollo/react-hooks";
import useForm from "react-hook-form";
import { User, Entry } from "../types";
import { parse, format, set } from "date-fns";
import { CREATE_ENTRY, LIST_ENTRIES } from "../util";
import { ExecutionResult } from "graphql";

type Props = {
  currentUser: User;
  updateInvitation?: (arg0: number) => void;
  toggleDisplayCreateEntryForm: () => void;
};

const CreateEntry: React.FC<Props> = ({
  currentUser,
  updateInvitation,
  toggleDisplayCreateEntryForm,
}) => {
  const [createEntryMutation] = useMutation(CREATE_ENTRY, {
    update(cache, { data: { createEntry } }) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      if (updateInvitation) {
        updateInvitation(createEntry.id);
      }
      // console.warn({ cachedData }, { createEntry });
      cache.writeQuery({
        query: LIST_ENTRIES,
        data: {
          listEntries: cachedData
            ? [...cachedData.listEntries, createEntry]
            : [{ ...createEntry }],
        },
      });
    },
  });

  const { handleSubmit, register, errors } = useForm();

  // console.warn({ currentUser });

  const onSubmit = async (values: any) => {
    if (currentUser) {
      // console.warn({ values });

      const time =
        Number(values.duration_h) * 60 * 60 +
        Number(values.duration_m) * 60 +
        Number(values.duration_s);

      const completedDate = parse(
        values.completed_date,
        "MM/dd/yyyy",
        new Date()
      );
      const completedTime = parse(values.completed_time, "HH:mm", new Date());

      const completedAt = set(completedDate, {
        hours: completedTime.getHours(),
        minutes: completedTime.getMinutes(),
      });

      const userWeight = currentUser.currentWeight;
      const userHeight = currentUser.currentHeight;
      // const hrInfo: { maxHr?: number; avgHr?: number } = {};
      // if (values.maxHr) hrInfo["maxHr"] = values.maxHr;
      // if (values.avgHr) hrInfo["avgHr"] = values.avgHr;
      const payload = {
        userId: Number(currentUser.id),
        time: Number(time),
        distance: Number(values.distance),
        strokeRate: Number(values.strokeRate),
        completedAt: format(completedAt, "yyyy-MM-dd HH:mm:ss"),
        userWeight,
        userHeight,
        // ...hrInfo,
        maxHr: Number(values.maxHr),
        avgHr: Number(values.avgHr),
      };

      // console.warn({ payload });

      try {
        const result: ExecutionResult<any> = await createEntryMutation({
          variables: payload,
        });
        console.warn({ result });
        toggleDisplayCreateEntryForm();
      } catch (err) {
        console.warn({ err });
      }
    } else {
      console.error("No current user", currentUser);
    }
  };

  // console.warn({ errors });

  return (
    <div className="my-3 max-w-md mx-auto">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-6 py-6 pt-6"
        >
          <div className="pb-4 flex">
            <div className="pr-2">
              <input
                name="distance"
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "Numbers only PLS",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="distance (m)"
              />
              {errors.distance && errors.distance.message}
            </div>
            <div className="">
              <input
                name="strokeRate"
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "Numbers only PLS",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="stroke rate (s/m)"
              />
            </div>
          </div>
          <div className="flex">
            <input
              name="duration_h"
              ref={register({})}
              className="shadow appearance-none border rounded w-full mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
              placeholder="hh"
            />
            <input
              name="duration_m"
              ref={register({})}
              className="shadow appearance-none border rounded w-full mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
              placeholder="mm"
            />
            <input
              name="duration_s"
              ref={register({})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
              placeholder="ss"
            />
          </div>

          <div className="pb-4 flex mt-4">
            <div className="pr-2">
              <input
                name="avgHr"
                ref={register({})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Avg HR"
              />
              {errors.avgHr && errors.avgHr.message}
            </div>
            <div className="">
              <input
                name="maxHr"
                ref={register({})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Max HR"
              />
            </div>
          </div>
          <div className="pb-4 flex">
            <div className="pr-2">
              <label
                htmlFor="completed_date"
                className="text-sm block font-bold pb-2"
              >
                Completed On
              </label>
              <input
                name="completed_date"
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/i,
                    message: "MM/DD/YYYY PLS",
                  },
                })}
                defaultValue={format(new Date(), "MM/dd/yyyy")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div>
              <label
                htmlFor="completed_time"
                className="text-sm block font-bold pb-2"
              >
                hh:mm
              </label>
              <input
                name="completed_time"
                ref={register({})}
                defaultValue={format(new Date(), "HH:mm")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                placeholder="HH:MM"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={toggleDisplayCreateEntryForm}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEntry;
