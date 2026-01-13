import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import ConfirmModal from './ComfirmModal';

function FormExample() {
  const { Formik } = formik;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phone: yup.string().required('Phone is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    terms: yup.bool().oneOf([true], 'You must agree'),
  });

  const handleConfirm = () => {
    console.log('Submitted data:', formData);
    setShowModal(false);
  };

  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={{
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          terms: false,
        }}
        onSubmit={(values) => {
          setFormData(values);
          setShowModal(true);
        }}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>Phone</Form.Label>
                <InputGroup>
                  <InputGroup.Text>📞</InputGroup.Text>
                  <Form.Control
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="6">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                name="terms"
                label="Agree to terms and conditions"
                onChange={handleChange}
                isInvalid={!!errors.terms}
                feedback={errors.terms}
                feedbackType="invalid"
              />
            </Form.Group>

            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>

      {/* MODAL */}
      <ConfirmModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
        title="Confirm your information"
        body={
          formData && (
            <div>
              <p><b>First Name:</b> {formData.firstName}</p>
              <p><b>Last Name:</b> {formData.lastName}</p>
              <p><b>Phone:</b> {formData.phone}</p>
              <p><b>Email:</b> {formData.email}</p>
            </div>
          )
        }
      />
    </>
  );
}

export default FormExample;
