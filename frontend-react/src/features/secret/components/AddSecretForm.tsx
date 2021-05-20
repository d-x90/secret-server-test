import { useFormik } from 'formik';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createSecretAsync } from '../secretSlice';
import FormField from './FormField';
import * as Yup from 'yup';
import { CreateSecretDto } from '../secretAPI';
import ReactTooltip from 'react-tooltip';

const StyledAddSecretForm = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;

  > h2 {
    font-size: 3rem;
    margin: 0 auto;
    margin-bottom: 12px;
  }

  > form {
    display: flex;
    flex-direction: column;

    > .submit-btn {
      align-self: center;
      padding: 8px;
      min-width: 25%;
      margin: 6px auto;
      font-size: 18px;
      cursor: pointer;
      background-color: #3498db;
      color: white;
      border: 1px solid grey;
      border-radius: 4px;

      &:hover {
        background-color: #58b2ee;
      }
    }
  }

  hr {
    width: 90%;
    margin: 0 auto;
  }

  > .currently-fetched-secret {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 0 auto;

    > h2 {
      font-size: 3rem;
      align-self: center;
      margin: 8px auto;
    }

    > .data-field {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      font-size: 2rem;

      > * {
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

const AddSecretForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const currentlyFetchedSecret = useAppSelector(
    (state) => state.secret.currentlyFetchedSecret
  );

  const formik = useFormik({
    initialValues: {
      secret: '',
      expireAfterViews: 1,
      expireAfter: 0,
    },
    validationSchema: Yup.object({
      secret: Yup.string()
        .max(60, 'Must be 60 characters or less')
        .required('Required'),
      expireAfterViews: Yup.number()
        .min(1, 'Must have at least 1 view count')
        .required('Required'),
      expireAfter: Yup.number()
        .min(0, 'Must be 0 or more')
        .required('Required'),
    }),
    onSubmit: (values: CreateSecretDto) => {
      dispatch(createSecretAsync(values));
    },
  });

  return (
    <StyledAddSecretForm>
      <h2>Add new secret</h2>
      <form onSubmit={formik.handleSubmit}>
        <FormField
          key="secret"
          name="secret"
          label="New secret"
          type="text"
          value={formik.values.secret}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.secret}
          isTouched={Boolean(formik.touched.secret)}
        />

        <FormField
          key="expireAfterViews"
          name="expireAfterViews"
          label="Expire after views"
          type="number"
          min={1}
          value={formik.values.expireAfterViews}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.expireAfterViews}
          isTouched={Boolean(formik.touched.expireAfterViews)}
        />

        <FormField
          key="expireAfter"
          name="expireAfter"
          label="Number of minutes until expiration"
          type="number"
          value={formik.values.expireAfter}
          min={0}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.expireAfter}
          isTouched={Boolean(formik.touched.expireAfter)}
        />
        <button type="submit" className="submit-btn">
          Add secret
        </button>
      </form>
      <hr />
      {currentlyFetchedSecret && (
        <div className="currently-fetched-secret">
          <h2>Last fetched secret</h2>
          <div className="data-field">
            <span>Secret:</span>
            <span>{currentlyFetchedSecret?.secretText}</span>
          </div>

          <div className="data-field">
            <span>Hash:</span>
            <span
              data-tip={currentlyFetchedSecret?.hash}
              data-place="top"
              data-delay-show="600"
            >
              {currentlyFetchedSecret?.hash}
            </span>
          </div>

          <div className="data-field">
            <span>Expires at:</span>
            <span>
              {currentlyFetchedSecret?.expiresAt !== null
                ? new Date(currentlyFetchedSecret?.expiresAt).toLocaleString()
                : 'never'}
            </span>
          </div>

          <div className="data-field">
            <span>Remaining views:</span>
            <span>{currentlyFetchedSecret?.remainingViews}</span>
          </div>
        </div>
      )}
      <ReactTooltip />
    </StyledAddSecretForm>
  );
};

export default AddSecretForm;
