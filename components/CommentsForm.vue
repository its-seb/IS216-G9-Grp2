<script setup>
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "~/store/userStore";
import { Form, Field } from "vee-validate";
import { useCommentsStore } from "~/store/commentsStore";

const commentsStore = useCommentsStore();
const userStore = useUserStore();
const route = useRoute();
const recipeId = route.params.rid;
const commentText = ref("");

const validateComment = (value) => {
  if (!value) {
    return "A comment is needed!";
  }
  return true;
};

const addComment = async (values) => {
  let commentBody = values.commentBody;
  let commentId = uuidv4() + recipeId;
  const { data } = await useFetch("/api/addComment", {
    method: "POST",
    body: {
      recipeId: recipeId,
      parentCommentId: "0",
      commentId: commentId,
      userId: userStore.user.uniqueUserId,
      commentBody: commentBody,
    },
    initialCache: false,
  });
  if (data) {
    commentsStore.commentsScore.value[commentId] = {
      userVote: 1,
      voteCount: 1,
    };
    commentText.value = "";
    commentsStore.addNewComment({
      commentBody: commentBody,
      commentId: commentId,
      createdAt: new Date().toISOString(),
      parentCommentId: "0",
      profileHandle: userStore.user.profileHandle,
      profilePicture: userStore.user.profilePicture,
      recipeId: recipeId,
      userId: userStore.user.uniqueUserId,
    });
  }
};
</script>

<template>
  <div>
    <div v-if="!userStore.user">
      <a href="#login-register-modal">
        <div class="relative h-[100px] flex">
          <textarea
            class="textarea textarea-bordered w-full h-full top-0 left-0 cursor-pointer absolute"
          ></textarea>
          <div class="text-center z-10 mx-auto my-auto">
            <p>Have a comment?</p>
            <p class="btn">Sign in now!</p>
          </div>
        </div>
      </a>
    </div>
    <div v-else>
      <Form @submit="addComment">
        <Field
          name="commentBody"
          as="textarea"
          placeholder="Add a comment"
          class="textarea textarea-bordered w-full h-[100px] mr-10 block"
          v-model="commentText"
          :rules="validateComment"
        />
        <input type="submit" value="Submit" class="btn btn-sm mr-1 mt-3 mb-3" />
      </Form>
    </div>
  </div>
</template>

<style></style>
