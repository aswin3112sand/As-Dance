import React from "react";

function joinClasses(...values) {
  return values.filter(Boolean).join(" ");
}

const FormField = React.forwardRef(function FormField({
  id,
  label,
  as = "input",
  className = "",
  inputClassName = "",
  hint = "",
  feedback = "",
  feedbackTone = "error",
  trailingAction = null,
  ...props
}, ref) {
  const Component = as;
  const inputClasses = joinClasses(
    "form-input",
    as === "textarea" ? "form-input--textarea" : "",
    trailingAction ? "form-input--has-action" : "",
    inputClassName
  );
  const feedbackClasses = joinClasses(
    "form-feedback",
    feedback ? `form-feedback--${feedbackTone}` : ""
  );

  return (
    <div className={joinClasses("form-field", className)}>
      <Component ref={ref} id={id} className={inputClasses} placeholder=" " {...props} />
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {trailingAction}
      {hint ? <span className="form-hint">{hint}</span> : null}
      {feedback ? <span className={feedbackClasses}>{feedback}</span> : null}
    </div>
  );
});

export default FormField;
