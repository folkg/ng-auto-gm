export interface UserData {
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  accessToken: string;
  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
  uid: string;
}
