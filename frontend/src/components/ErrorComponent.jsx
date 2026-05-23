import React from "react";

const ErrorComponent = (props) => {
  return (
    <div>
      <h1>Something went wrong! </h1>
      <br />
      Error message: {props.error.message}
    </div>
  );
};

export default ErrorComponent;
