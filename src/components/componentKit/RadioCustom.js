import React from 'react'
import { Field } from 'redux-form'

const RadioCustom = ({ input, title, val, name, id, meta: { touched, error } }) => (
  <div>
    <Field component='input' type='radio' name={name} style={{visibility: 'hidden', margin: -5}} value={val}/>
  </div>
)

export default RadioCustom
