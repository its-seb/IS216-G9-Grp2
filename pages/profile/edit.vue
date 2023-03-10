<template>
  <div class="container mx-auto min-h-screen">
    <div v-if="!userStore.user" class="section p-10 max-w-6xl m-auto">
      <NoExist
        errorTitle="User Not Found"
        errorMessage="Please login and try again!"
      />
    </div>

    <div v-else class="section p-10 max-w-6xl m-auto">
      <h1 class="text-5xl font-bold">Edit Profile</h1>
      <div class="flex flex-col gap-5 mt-5 justify-center">
        <div class="form-control">
          <label class="label label-title text-slate-600">
            <span class="label-text">Profile Image</span>
          </label>

          <div
            class="w-32 h-32 border-2 border-dashed rounded-xl cursor-pointer text-[#a5a5a5] hover:bg-blue-50 hover:border-blue-500 hover:text-blue-500"
            @click="$refs.fileUploadInput.click()"
          >
            <img
              v-if="uploadedFile !== null || previewURL !== ''"
              :src="previewURL"
              alt=""
              class="rounded-xl hover:opacity-75 object-cover w-full h-full"
            />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              class="p-8"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <input
            class="hidden"
            type="file"
            ref="fileUploadInput"
            accept="image/png, image/gif, image/jpeg"
            @change="handleFileSelection"
          />
        </div>

        <div class="form-control">
          <label class="label label-title text-slate-600">
            <span class="label-text">Display Name</span>
          </label>
          <input
            type="text"
            class="input input-bordered w-full"
            v-model="displayName"
          />
        </div>

        <div class="form-control">
          <label class="label label-title text-slate-600">
            <span class="label-text">Handle</span>
          </label>
          <div class="relative">
            <input
              type="text"
              class="input input-bordered w-full"
              @change="validateHandle($event)"
              @keyup="validateHandle($event)"
              @paste="validateHandle($event)"
              v-model="userHandle"
            />

            <span
              v-if="checkingDuplicateHandle"
              style="border-top-color: transparent"
              class="check-handle-spinner absolute bottom-[17px] right-[15px]"
            ></span>
          </div>
          <span v-if="!isHandleValid" class="mt-2 text-red-500 text-sm">
            That handle has been taken. Please choose another handle.
          </span>
          <span v-if="isHandleEmpty" class="mt-2 text-red-500 text-sm">
            Profile handle cannot be empty. Please choose a handle.
          </span>
          <span v-if="isHandleTooLong" class="mt-2 text-red-500 text-sm">
            Profile handle is too long. Please choose a handle shorter than 18
            characters.
          </span>
          <span v-if="isHandleIllegal" class="mt-2 text-red-500 text-sm">
            Profile handle contains illegal characters. Please use only letters
            and numbers.
          </span>
        </div>
        <div class="w-[150px] self-end">
          <button
            class="btn btn-action primary-color"
            @click="saveProfile"
            :disabled="
              isHandleEmpty ||
              isHandleTooLong ||
              isHandleIllegal ||
              checkingDuplicateHandle ||
              !isHandleValid
            "
          >
            Save Changes
          </button>
        </div>
      </div>
      <input
        type="checkbox"
        id="my-modal"
        class="modal-toggle"
        ref="cbStatusModal"
      />
      <StatusModal modalID="my-modal" :modalState="modalState" />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~~/store/userStore";
const userStore = useUserStore();
const isHandleValid = ref(true);
const isHandleEmpty = ref(false);
const isHandleTooLong = ref(false);
const isHandleIllegal = ref(false);
const checkingDuplicateHandle = ref(false);
const userHandle = ref(userStore?.user?.profileHandle);
const displayName = ref(userStore?.user?.displayName);
const previewURL = ref(userStore?.user?.profilePicture);
const uploadedFile = ref(null);

const cbStatusModal = ref(null);

const modalState = ref({
  status: "loading",
  title: "Loading",
  message: "Please wait...",
});

const validateHandle = async (e) => {
  if (e.target.value.length === 0) {
    isHandleEmpty.value = true;
    return;
  } else {
    isHandleEmpty.value = false;
  }

  if (e.target.value.length > 18) {
    isHandleTooLong.value = true;
    return;
  } else {
    isHandleTooLong.value = false;
  }

  if (/^[A-Za-z0-9]*$/.test(e.target.value)) {
    isHandleIllegal.value = true;
    return;
  } else {
    isHandleIllegal.value = false;
  }

  if (userStore.user.profileHandle === e.target.value) {
    isHandleValid.value = true;
    return;
  }

  checkingDuplicateHandle.value = true;

  const { data } = await useFetch("/api/getProfileByHandle", {
    initialCache: false,
    method: "GET",
    params: {
      handle: e.target.value,
    },
  });

  if (
    data.value === undefined ||
    data.value === null ||
    Object.keys(data.value).length == 1
  ) {
    isHandleValid.value = false;
    checkingDuplicateHandle.value = false;
  } else {
    isHandleValid.value = true;
    checkingDuplicateHandle.value = false;
  }
};

const handleFileSelection = (e) => {
  uploadedFile.value = e.target.files[0];
};

const saveProfile = async () => {
  if (
    !isHandleValid.value ||
    isHandleEmpty.value ||
    isHandleTooLong.value ||
    isHandleIllegal.value
  ) {
    return;
  }

  modalState.value = {
    status: "loading",
    title: "Loading",
    message: "Please wait...",
  };
  cbStatusModal.value.checked = true;

  let profilePicture = userStore.user.profilePicture;

  if (uploadedFile.value !== null) {
    let formData = new FormData();
    formData.append("files", uploadedFile.value);
    let { data } = await useFetch("/express/upload", {
      headers: {
        "Content-Disposition": formData,
      },
      method: "POST",
      body: formData,
    });
    profilePicture = data.value.urls[0].url;
  }

  $fetch("/api/updateProfile", {
    method: "POST",
    body: {
      uniqueUserId: userStore.user.uniqueUserId,
      displayName: displayName.value,
      profileHandle: userHandle.value,
      profilePicture: profilePicture,
    },
  })
    .then((res) => {
      let temp = { ...userStore.user };
      temp.profilePicture = profilePicture;
      temp.displayName = displayName.value;
      temp.profileHandle = userHandle.value;
      userStore.setUser(temp);
      modalState.value = {
        status: "success",
        title: "Success",
        message: "Profile updated successfully!",
      };
    })
    .catch((err) => {
      console.log("err", err);
      modalState.value = {
        status: "failure",
        title: "Oops!",
        message: "Failed to update profile.",
      };
    });
};

watch(uploadedFile, () => {
  previewURL.value = URL.createObjectURL(uploadedFile.value);
});

useHead({
  title: userStore?.user
    ? "Edit Profile - " + userStore.user.profileHandle + " - NOM.NOM"
    : "User Not Found - NOM.NOM",
});
</script>
