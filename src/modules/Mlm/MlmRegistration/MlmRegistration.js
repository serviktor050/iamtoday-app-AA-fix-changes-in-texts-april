import React, { Component } from "react";
import cookie from "react-cookie";
import { api } from "config";
import * as selectors from "../selectors";
import MlmRegistrationForm from "./MlmRegistrationForm";
import { connect } from "react-redux";
import Layout from "components/componentKit2/Layout";
import Modal from "boron-react-modal/FadeModal";
import { dict } from "dict";
import styles from "./styles.css";

const page = "mlm-registration";

const selectValueOf = (value) =>
  value ? (value.value ? value.value : value) : value;
const modalContentStyle = { borderRadius: "18px", padding: "30px" };

class MlmRegistration extends Component {
  state = {
    initialValues: {},
  };

  constructor(props, context) {
    super(props, context);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createUser(data, error) {
    const payload = {
      authToken: cookie.load("token"),
      data: data,
    };
    var timeout = (time) => {
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, time);
      });
    };

    return timeout(3000).then((x) =>
      fetch(`${api}/mlm/user-create`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then((response) => {
          return response.json();
        })
        .catch((e) => error && error(e))
    );
  }

  isServerError(responseData) {
    return responseData && !responseData.isSuccess;
  }

  getServerErrorMessage(response, lang) {
    if (!response) {
      return dict[lang]["server.error.unexpectedError"];
    }
    if (
      "Exception of type 'RM.Server.Core.Exceptions.DuplicateLoginException' was thrown." ===
      response.errorMessage
    ) {
      return dict[lang]["mlm.registration.submitError.DuplicateLoginException"];
    } else {
      return dict[lang]["server.error.unexpectedError"];
    }
  }

  handleSubmit(formData) {
    const { lang } = this.props;
    const self = this;
    const postData = this.createPostData(formData);
    this.refs.loadingModal.show();
    this.createUser(postData, () =>
      this.handleServerError(null, lang, self)
    ).then((responseData) => {
      if (this.isServerError(responseData)) {
        this.handleServerError(responseData, lang, self);
      } else {
        this.handleSuccess(self);
      }
    });
  }

  handleSuccess(self) {
    self.setState({ success: true });
    this.refs.loadingModal.hide();
    self.refs.successModal.show();
  }

  handleServerError(responseData, lang, self) {
    const error = this.getServerErrorMessage(responseData, lang);
    self.setState({ serverError: error });
    this.refs.loadingModal.hide();
    self.refs.serverErrorModal.show();
  }

  createPostData = (fromData) => {
    const { photo } = this.props;
    const verificationStatus = 0;
    return {
      firstName: fromData.firstName,
      lastName: fromData.lastName,
      middleName: fromData.middleName,
      gender: selectValueOf(fromData.gender),
      region: selectValueOf(fromData.region),
      phone: fromData.phone,
      city: selectValueOf(fromData.city),
      country: selectValueOf(fromData.country),
      birthday: fromData.birthday,
      email: fromData.email,
      photo: photo,
      userInfoEducations: (fromData.partnerInfoEducations || [])
        .filter(
          (f) => f.university || f.specialty || f.endYear || f.diplomaNumber
        )
        .map((pe) => {
          return {
            university: pe.university,
            specialty: pe.specialty,
            endYear: pe.endYear ? pe.endYear.value : null,
            diplomaNumber: pe.diplomaNumber,
            verificationStatus: verificationStatus,
          };
        }),
      userInfoWorks: (fromData.partnerInfoWorks || [])
        .filter((f) => f.firmName || f.startDate || f.endDate || f.position)
        .map((pe) => {
          return {
            firmName: pe.firmName,
            startDate: pe.startDate,
            endDate: pe.endDate,
            isCurrent: pe.isCurrent,
            position: pe.position,
            verificationStatus: verificationStatus,
          };
        }),

      customUserFields: {
        workSeniority: fromData.workSeniority,
      },
      verificationStatus: verificationStatus,
      userInfoDocuments: (fromData.partnerInfoDocuments || [])
        .filter((f) => f.fileId || f.url)
        .map((pe) => {
          return {
            documentName: pe.documentName,
            fileName: pe.fileName,
            fileId: pe.fileId,
            url: pe.url,
            verificationStatus: verificationStatus,
          };
        }),
    };
  };

  render() {
    const { lang } = this.props;
    return (
      <Layout page={page} location={location} buy={true}>
        <MlmRegistrationForm onSubmit={this.handleSubmit} />
        {
          <Modal ref="serverErrorModal" contentStyle={modalContentStyle}>
            <h2>{dict[lang]["mlm.mlmRegistration.submitError.title"]}</h2>
            <br />
            <p className={styles.serverError}>{this.state.serverError}</p>
            <div
              className={styles.btnPrimaryCenter}
              onClick={() => this.refs.serverErrorModal.hide()}
            >
              {dict[lang]["regs.continue"]}
            </div>
          </Modal>
        }
        {
          <Modal ref="successModal" contentStyle={modalContentStyle}>
            <h2>{dict[lang]["mlm.mlmRegistration.submitSuccess.title"]}</h2>
            <br />
            <button
              className={styles.btnPrimaryCenter}
              onClick={() => this.refs.successModal.hide()}
            >
              {dict[lang]["regs.continue"]}
            </button>
          </Modal>
        }
        {
          <Modal
            ref="loadingModal"
            contentStyle={modalContentStyle}
            backdrop={false}
          >
            <h2 className={styles.entryTitleCenter}>
              {dict[lang]["regs.loading"]}
            </h2>
            <div className={styles.textCenter}>
              <div className={styles.loaderMain} />
            </div>
          </Modal>
        }
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    lang: state.lang,
    photo: state.mlm.photo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MlmRegistration);
