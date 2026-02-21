import { check } from "express-validator";

export const loginCheck = [
  check("email").trim().isEmail().withMessage("Incorrect e-mail address"),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password has to be at least 6 characters long"),
];

export const registerCheck = [
  ...loginCheck,
  check("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
];
