'use strict';

const displayPassword = () => {
  const passwordBox = document.querySelector('#password');
  const passwordTypes = { text: 'password', password: 'text' };
  passwordBox.type = passwordTypes[passwordBox.type];
};
const showSignUp = () => {
  const signIn = document.querySelector('.signInSection');
  const signUp = document.querySelector('.signUpSection');
  signIn.classList.add('hidden');
  signUp.classList.remove('hidden');
};
