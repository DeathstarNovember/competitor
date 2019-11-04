import React, { useState } from "react";
import { Entry, User, Comment } from "../types";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_COMMENT, LIST_ENTRIES, UPDATE_COMMENT } from "../util";
import { ExecutionResult } from "graphql";
import { MdEdit, MdDelete, MdComment } from "react-icons/md";
import useForm from "react-hook-form";
import CreateComment from "./CreateComment";

type Props = {
  entry: Entry;
  currentUser: User;
};

type CommentProps = {
  entry: Entry;
  comment: Comment;
  currentUser: User;
};

const CommentItem: React.FC<CommentProps> = ({
  comment,
  currentUser,
  entry,
}) => {
  const { handleSubmit, register, errors } = useForm();
  const [displayUpdateForm, setDisplayUpdateForm] = useState(false);
  const handleUpdateFormToggle = () => {
    setDisplayUpdateForm(!displayUpdateForm);
  };
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT, {
    update(cache, { data: { updateComment } }) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      // console.warn({ cachedData }, { updateComment });
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
                  comments: [
                    ...entry.comments.filter(
                      cachedComment => cachedComment.id !== updateComment.id
                    ),
                    updateComment,
                  ].sort(
                    (a, b) =>
                      Number(new Date(b.insertedAt)) -
                      Number(new Date(a.insertedAt))
                  ),
                },
              ]
            : "No Data",
        },
      });
    },
  });
  const handleUpdateComment = async (values: any) => {
    const update = {
      id: comment.id,
      body: values.body,
      visibility: comment.visibility,
    };
    // console.warn({ update });
    try {
      const result: ExecutionResult<{
        updateComment: Comment;
      }> = await updateCommentMutation({
        variables: update,
      });
      setDisplayUpdateForm(false);
      console.warn({ result });
    } catch (err) {
      console.warn({ err });
    }
  };
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT, {
    update(cache) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      cache.writeQuery({
        query: LIST_ENTRIES,
        data: {
          listEntries: cachedData
            ? [
                ...cachedData.listEntries.filter(e => e.id !== entry.id),
                {
                  ...entry,
                  comments: currentUser
                    ? [
                        ...entry.comments.filter(
                          cachedComment => cachedComment.id !== comment.id
                        ),
                      ]
                    : [...entry.comments],
                },
              ]
            : [],
        },
      });
    },
  });
  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation({ variables: { id: commentId } });
  };
  const mine = comment.user.id === currentUser.id;
  const [displayTools, setDisplayTools] = useState(false);
  const toggleTools = () => {
    setDisplayTools(!displayTools);
  };
  return (
    <div className="flex-col mb-2 border-b last:border-b-0 border-gray-400">
      <div className="flex flex-1 justify-between">
        <div onClick={toggleTools} className="text-md font-semibold">
          {comment.user.firstName}
        </div>
        {mine && displayTools ? (
          <div className="flex">
            <div>
              <button onClick={handleUpdateFormToggle}>
                <MdEdit />
              </button>
            </div>
            <div>
              <button onClick={() => handleDeleteComment(comment.id)}>
                <MdDelete />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {displayUpdateForm && currentUser ? (
        <form onSubmit={handleSubmit(handleUpdateComment)}>
          <div className="pb-4 flex">
            <div className="pr-2 flex flex-1 justify-between">
              <input
                name="body"
                ref={register({
                  required: "Required",
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                defaultValue={`${comment.body}`}
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
      ) : (
        <div onClick={toggleTools}>{comment.body}</div>
      )}
    </div>
  );
};

const EntryComments: React.FC<Props> = ({ entry, currentUser }) => {
  const [displayComments, setDisplayComments] = useState(true);
  const [displayCommentsForm, setDisplayCommentsForm] = useState(false);
  // const [displayCommentsForm, setDisplayCommentsForm] = useState(
  //   !entry.comments.map(c => c.user.id).includes(currentUser.id)
  // );
  const setCommentsAndForm = (value: boolean) => {
    setDisplayComments(value);
    setDisplayCommentsForm(value);
  };
  const toggleDisplayComments = () => {
    setDisplayComments(!displayComments);
  };
  const toggleDisplayCommentsForm = () => {
    setDisplayCommentsForm(!displayCommentsForm);
  };
  return displayComments ? (
    <div>
      <div>
        <MdComment onClick={toggleDisplayComments} />
      </div>
      {displayCommentsForm ? (
        <CreateComment
          currentUser={currentUser}
          entry={entry}
          toggleDisplayCommentForm={toggleDisplayCommentsForm}
        />
      ) : null}
      {entry.comments
        .sort(
          (a, b) =>
            Number(new Date(b.insertedAt)) - Number(new Date(a.insertedAt))
        )
        .map((comment, commentId) => (
          <div key={`e${comment.id}c${commentId}`}>
            <CommentItem
              comment={comment}
              currentUser={currentUser}
              entry={entry}
            />
          </div>
        ))}
    </div>
  ) : (
    <div>
      <MdComment onClick={() => setCommentsAndForm(true)} />
    </div>
  );
};

export default EntryComments;
