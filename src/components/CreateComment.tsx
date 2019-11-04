import React from "react";
import { useMutation } from "@apollo/react-hooks";
import useForm from "react-hook-form";
import { User, Entry, Visibility } from "../types";
import { LIST_ENTRIES, CREATE_COMMENT } from "../util";
import { ExecutionResult } from "graphql";
import { MdComment } from "react-icons/md";

type Props = {
  currentUser: User;
  entry: Entry;
  toggleDisplayCommentForm: () => void;
};

const CreateComment: React.FC<Props> = ({
  currentUser,
  entry,
  toggleDisplayCommentForm,
}) => {
  const [createCommentMutation] = useMutation(CREATE_COMMENT, {
    update(cache, { data: { createComment } }) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      // console.warn({ cachedData }, { createEntry });
      cache.writeQuery({
        query: LIST_ENTRIES,
        data: {
          listEntries: cachedData
            ? [
                ...cachedData.listEntries.filter(
                  cachedEntry => cachedEntry.id !== entry.id
                ),
                {
                  ...entry,
                  comments: [...entry.comments, createComment],
                },
              ]
            : "No Data",
        },
      });
    },
  });

  const { handleSubmit, register, errors } = useForm();

  // console.warn({ currentUser });

  const onSubmit = async (values: any) => {
    if (currentUser) {
      // console.warn({ values });
      const payload = {
        userId: currentUser.id,
        entryId: entry.id,
        body: values.body,
        visibility: Visibility.PUBLIC,
      };
      // console.warn({ payload });
      try {
        const result: ExecutionResult<{
          createComment: Comment;
        }> = await createCommentMutation({
          variables: payload,
        });
        toggleDisplayCommentForm();
        console.warn({ result });
      } catch (err) {
        console.warn({ err });
      }
    } else {
      console.error("No current user", currentUser);
    }
  };

  // console.warn({ errors });

  return (
    <div className="my-1 max-w-md mx-auto">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-4 flex">
            <div className="pr-2 flex flex-1 justify-between">
              <input
                name="body"
                ref={register({
                  required: "Required",
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder={`${currentUser.warCry}`}
              />
              {errors.body && errors.body.message}
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <MdComment />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComment;
