import React from "react"

export type FormFieldProps = {
	label: string
	id: string
	autoComplete?: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e?: React.FocusEvent<HTMLInputElement, Element>) => void
    type: string
	invalidMessages: InvalidMessage[]
}

export type InvalidMessage = {
	message: string
	isInvalid: boolean
}

const FormField = (props: FormFieldProps) => (
	<div className="form__field">
		<label htmlFor={props.id} className="form__field__container__label">
			{props.label}
		</label>
		<div className="form__field__container">
			<input type={props.type} name={props.id} id={props.id} onChange={props.onChange} placeholder="" autoComplete={props.autoComplete} onBlur={props.onBlur} />
		</div>
		{props.invalidMessages.map((invalid: InvalidMessage, index: number) => invalid.isInvalid ? <p className="form__field__message" key={invalid.message + "-" + index}>{invalid.message}</p> : null )}
	</div>
)

export default FormField
