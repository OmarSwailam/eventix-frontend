/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import { passwordValidationRegex, specialCharacters } from "./../App";
import SingleSignonButtons from "./SingleSignonButtons";
import SeparatorLine from "./SeparatorLine";
import PasswordField from "./PasswordField";
import InvalidInput from "./InvalidInput";
function SignupForm({ isError }) {
  const validate = (values) => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = "Required";
    } else if (specialCharacters.test(values.firstName)) {
      errors.firstName = "letters only";
    } else if (/\s/.test(values.firstName)) {
      errors.firstName = "whitespace is not allowed";
    }

    if (!values.lastName) {
      errors.lastName = "Required";
    } else if (specialCharacters.test(values.lastName)) {
      errors.lastName = "letters only";
    } else if (/\s/.test(values.lastName)) {
      errors.lastName = "whitespace is not allowed";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "at least 8 characters!";
    } else if (!passwordValidationRegex.test(values.password)) {
      errors.password =
        "at least 1 lowercase letter, 1 uppercase letter, 1 symbol, 1 digit";
    }

    if (values.re_password !== values.password && formik.touched.re_password) {
      errors.re_password = "passwords are not identical";
    } else if (!values.re_password) {
      errors.re_password = "confirm assigned password";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      password: "",
      re_password: "",
      email: "",
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      try {
        const name = `${values.firstName} ${values.lastName}`;
        delete values.firstName;
        delete values.lastName;
        values.name = name;
        values.is_provider = false;
        console.log(values);
        const response = await fetch("http://127.0.0.1:8000/auth/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Sign up failed");
        }

        const data = await response.json();
        console.log("Sign up successful:", data);
      } catch (error) {
        console.error("Error signing up:", error.message);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="form__signup">
      <div className="container-fluid ">
        <p>Create account</p>
        <div className="row gy-3 justify-content-start">
          <div className="input-label-container col-12 col-sm-6">
            <label htmlFor="firstName">first name</label>
            <input
              id="firstName"
              name="firstName"
              className={`form-control ${
                isError(formik.errors.firstName, formik.touched.firstName)
                  ? "input-invalid"
                  : isError(!formik.errors.firstName, formik.touched.firstName)
                  ? "input-valid"
                  : null
              }`}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isError(formik.errors.firstName, formik.touched.firstName) ? (
              <InvalidInput>{formik.errors.firstName}</InvalidInput>
            ) : (
              ""
            )}
          </div>

          <div className="input-label-container col-12 col-sm-6">
            <label htmlFor="lastName">last name</label>
            <input
              id="lastName"
              name="lastName"
              className={`form-control ${
                isError(formik.errors.lastName, formik.touched.lastName)
                  ? "input-invalid"
                  : isError(!formik.errors.lastName, formik.touched.lastName)
                  ? "input-valid"
                  : null
              }`}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isError(formik.errors.lastName, formik.touched.lastName) ? (
              <InvalidInput>{formik.errors.lastName}</InvalidInput>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="input-label-container row gy-3">
          <div className="col-12">
            <label htmlFor="email">email address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${
                isError(formik.errors.email, formik.touched.email)
                  ? "input-invalid"
                  : isError(!formik.errors.email, formik.touched.email)
                  ? "input-valid"
                  : null
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isError(formik.errors.email, formik.touched.email) ? (
              <InvalidInput>{formik.errors.email}</InvalidInput>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="row gy-3">
          <PasswordField
            id="password"
            label="password"
            value={formik.values.password}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            col="sm-6"
            className={
              isError(formik.errors.password, formik.touched.password)
                ? "input-invalid"
                : isError(!formik.errors.password, formik.touched.password)
                ? "input-valid"
                : null
            }
            error={
              isError(formik.errors.password, formik.touched.password) ? (
                <InvalidInput>{formik.errors.password}</InvalidInput>
              ) : (
                ""
              )
            }
          />
          <PasswordField
            id="re_password"
            label="confirm password"
            value={formik.values.re_password}
            handleChange={formik.handleChange}
            // handleBlur={formik.handleBlur}
            className={
              formik.errors.re_password
                ? "input-invalid"
                : !formik.errors.re_password &&
                  formik.values.re_password.length > 1
                ? "input-valid"
                : ""
            }
            col="sm-6"
            error={
              formik.errors.re_password ? (
                <InvalidInput>{formik.errors.re_password}</InvalidInput>
              ) : (
                ""
              )
            }
          />

          <p style={{ marginTop: "6px", fontSize: "10px" }}>
            Use or more 8 characters with a mix of letters, numbers and symbols
          </p>
        </div>

        <button
          className="btn btn-gradient"
          style={{ margin: "0 auto" }}
          type="submit"
        >
          Sign Up
        </button>
        <SeparatorLine />
        <SingleSignonButtons />
      </div>
    </form>
  );
}

export default SignupForm;
