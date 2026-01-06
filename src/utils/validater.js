import validator from "validator";

// data coming from req.body (JS object)

export const validate = (data) => {
  const mandatoryField = ["fname", "emailId", "password"];

  const isAllowed = mandatoryField.every((k) =>
    Object.keys(data).includes(k)
  );

  if (!isAllowed)
    throw new Error("Some fields are missing");

  if (!validator.isEmail(data.emailId))
    throw new Error("Invalid Email");

  if (!validator.isStrongPassword(data.password))
    throw new Error("Weak password");
};
