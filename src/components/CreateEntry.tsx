import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import useForm from "react-hook-form";
import { User, Entry, ChallengeInvite, Achievement } from "../types";
import { parse, format, set } from "date-fns";
import {
  CREATE_ENTRY,
  LIST_ENTRIES,
  GET_USER,
  CREATE_ACHIEVEMENT,
  LIST_ACHIEVEMENTS,
} from "../util";
import { ExecutionResult } from "graphql";
import { AchievementTypes } from "../enums";

type Props = {
  currentUserId: number;
  invitation?: ChallengeInvite;
  updateInvitation?: (responseId: number) => Promise<void>;
  toggleDisplayCreateEntryForm: () => void;
};

const CreateEntry: React.FC<Props> = ({
  currentUserId,
  invitation,
  updateInvitation,
  toggleDisplayCreateEntryForm,
}) => {
  const [createEntryMutation] = useMutation(CREATE_ENTRY, {
    update(cache, { data: { createEntry } }) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      // console.warn({ cachedData }, { createEntry });
      if (cachedData) {
        cache.writeQuery({
          query: LIST_ENTRIES,
          data: {
            listEntries: [
              ...cachedData.listEntries,
              { ...createEntry, __typename: "Entry" },
            ],
          },
        });
      }
    },
  });
  const [createAchievementMutation] = useMutation(CREATE_ACHIEVEMENT, {
    update(cache, { data: { createAchievement } }) {
      const cachedAchievementData: {
        listAchievements: Achievement[];
      } | null = cache.readQuery({
        query: LIST_ACHIEVEMENTS,
      });
      const cachedEntriesData: {
        listEntries: Entry[];
      } | null = cache.readQuery({ query: LIST_ENTRIES });
      // console.warn({ cachedAchievementData }, { createAchievement });
      if (cachedAchievementData && cachedEntriesData) {
        cache.writeQuery({
          query: LIST_ACHIEVEMENTS,
          data: {
            listAchievements: [
              ...cachedAchievementData.listAchievements,
              { ...createAchievement, __typename: "Achievement" },
            ],
          },
        });
        cache.writeQuery({
          query: LIST_ENTRIES,
          data: {
            listEntries: [
              ...cachedEntriesData.listEntries.filter(
                cachedEntry => cachedEntry.id !== createAchievement.entry.id
              ),
              {
                ...cachedEntriesData.listEntries.filter(
                  cachedEntry => cachedEntry.id === createAchievement.entry.id
                )[0],
                achievement: {
                  ...createAchievement,
                  __typename: "Achievement",
                },
              },
            ],
          },
        });
      }
    },
  });

  const { handleSubmit, register, errors } = useForm();
  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useQuery(GET_USER, { variables: { id: currentUserId } });
  if (userLoading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-6 rounded-lg shadow-xl">User Loading....</div>
      </div>
    );
  }
  if (userError) {
    return (
      <div className="p-6 bg-red-200  rounded-lg shadow-xl text-red-900">
        Error: {JSON.stringify(userError)}
      </div>
    );
  }
  const currentUser: User = { ...userData.getUser };
  const createAchievement = async (
    entryId: number,
    achievementType: AchievementTypes
  ) => {
    const achievementVariables = {
      __typename: "Achievement",
      entryId,
      userId: currentUserId,
      achievementType,
    };

    console.warn({ achievementVariables });
    try {
      const achievementResult: ExecutionResult<any> = await createAchievementMutation(
        { variables: achievementVariables }
      );
      console.warn({ achievementResult });
    } catch (err) {
      console.warn({ err });
    }
  };
  const onSubmit = async (values: any) => {
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
    const payload = {
      userId: Number(currentUser.id),
      time: Number(time),
      distance: Number(values.distance),
      strokeRate: Number(values.strokeRate),
      completedAt: format(completedAt, "yyyy-MM-dd HH:mm:ss"),
      userWeight,
      userHeight,
      maxHr: Number(values.maxHr),
      avgHr: Number(values.avgHr),
    };

    // console.warn({ payload });

    try {
      const result: ExecutionResult<any> = await createEntryMutation({
        variables: payload,
      });
      const createdEntry = { ...result.data.createEntry };

      // Update the invitation with the newly created entry
      // (That is a response to a challenge)
      if (updateInvitation && invitation) {
        updateInvitation(createdEntry.id);
      }
      if (currentUser.achievements) {
        if (createdEntry.time % 60 === 0) {
          console.warn("created Entry Time is a multiple of 60");
          const userAchievementsDistForTime = currentUser.achievements.filter(
            achievement =>
              achievement.achievementType ===
                AchievementTypes.bestDistanceEntryForTime &&
              achievement.entry.time === createdEntry.time
          );
          if (userAchievementsDistForTime.length) {
            const bestUserAchievementsDistForTime = userAchievementsDistForTime.sort(
              (a, b) => a.entry.distance - b.entry.distance
            )[0];
            if (
              bestUserAchievementsDistForTime.entry.distance <
              createdEntry.distance
            ) {
              console.warn("this entry is longer");
              createAchievement(
                createdEntry.id,
                AchievementTypes.bestDistanceEntryForTime
              );
            }
          } else {
            console.warn("User has no time achievements set");
            createAchievement(
              createdEntry.id,
              AchievementTypes.bestDistanceEntryForTime
            );
          }
        }
        if (createdEntry.distance % 25 === 0) {
          console.warn("created Entry Distance is a multiple of 25");
          const userAchievementsTimeForDist = currentUser.achievements.filter(
            achievement =>
              achievement.achievementType ===
                AchievementTypes.bestTimeEntryForDistance &&
              achievement.entry.distance === createdEntry.distance
          );
          if (userAchievementsTimeForDist.length) {
            const bestUserAchievementsTimeForDist = userAchievementsTimeForDist.sort(
              (a, b) => b.entry.time - a.entry.time
            )[0];
            console.warn({ bestUserAchievementsTimeForDist });
            if (
              bestUserAchievementsTimeForDist.entry.time > createdEntry.time
            ) {
              console.warn("This entry is faster");
              createAchievement(
                createdEntry.id,
                AchievementTypes.bestTimeEntryForDistance
              );
            }
          } else {
            console.warn("no distance records set");
            createAchievement(
              createdEntry.id,
              AchievementTypes.bestTimeEntryForDistance
            );
          }
        }
      } else {
        console.warn("user has no achievements");
        if (createdEntry.time % 60 === 0) {
          createAchievement(
            createdEntry.id,
            AchievementTypes.bestDistanceEntryForTime
          );
        }
        if (createdEntry.distance % 25 === 0) {
          createAchievement(
            createdEntry.id,
            AchievementTypes.bestTimeEntryForDistance
          );
        }
      }
      toggleDisplayCreateEntryForm();
    } catch (err) {
      console.warn({ entryError: { ...err } });
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
                ref={register({
                  pattern: {
                    value: /^([1-9][0-9]+)?$/i,
                    message: "ex 160",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Avg HR"
              />
              {errors.avgHr && errors.avgHr.message}
            </div>
            <div className="">
              <input
                name="maxHr"
                ref={register({
                  pattern: {
                    value: /^([1-9][0-9]+)?$/i,
                    message: "ex 180",
                  },
                })}
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
