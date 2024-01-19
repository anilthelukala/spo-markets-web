import React, { useEffect } from "react";
import axios from "axios";
import { apiURL, frankieBackendUrl,kycFailedPageUrl,kycSuccessPageUrl } from "../../enviornment";
import { useNavigate } from 'react-router-dom';


const widgetConfiguration = {

  frankieBackendUrl: frankieBackendUrl,
  successScreen: {
    // ctaUrl: SuccessPage
    ctaUrl: kycSuccessPageUrl
  },
  failureScreen: {
    // ctaUrl: SuccessPage
    ctaUrl: kycFailedPageUrl
  },
  documentTypes: [{ type: 'PASSPORT' },
  {
    type: 'DRIVERS_LICENCE',
    digitalLicense: false
  }],
  idScanVerification:false,
  checkProfile: 'auto',
  maxAttemptCount: 5,
  googleAPIKey: false,
  phrases: {
    document_select: {
      title: 'Custom Text Here: Choose your ID',
      hint_message: "Choose which ID you'd like to provide.",
    },
  },
  requestAddress: { acceptedCountries: ['AUS'] },
  consentText:
    "I agree with the terms described in the Consent section of the Company's webpage",
};

function SmartUiKyc() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  useEffect(() => {
    getApiTokenAndInitlizeFranki();
  });
  async function getApiTokenAndInitlizeFranki() {
    const response = await axios.get(
      apiURL + "/frankieOne/createFrankieOneSession",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const convertJson = JSON.parse(response?.data?.data?.Token);
    console.log("convertJson", convertJson);
    window.addEventListener('FF_CHECK_RESULT', (async (e) => {
      console.log(e.detail);

      try {
        // Replace 'your-api-endpoint' with the actual API endpoint
        let params = {
          email:localStorage.getItem('username'),
          kycVerification:e.detail.resultSlug
        }
        const response = await axios.post(apiURL + '/user/kycStatus', params, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const { data} = response.data;
        localStorage.setItem("userKyc", data.USER.kycVerification);
        localStorage.setItem("kycVerificationBlocked", data.USER.kycVerificationBlocked);
        if(data.USER.kycVerificationBlocked){
          navigate('/kyc/failed');
        }
      } catch (error) {
        console.error('Kyc Update failed:', error);
        //showAlert('Data fetched unsuccessfully!', 'error');
      }
    }));

    window.addEventListener('FF_EXTERNAL_IDV_CHECK_COMPLETED', ((e) => {
      console.log(e.detail);
    }));
    window.frankieFinancial.initialiseOnboardingWidget({
      ffToken: convertJson?.token,
      applicantReference: username, /// the string reference that will be injected into this applicant's data, will be used to prefill data and can be used to request their details aftwerwards, both via Frankie API and Frankie Portal
      config: widgetConfiguration,
      width: 'AUTO',
      height: 'AUTO',
    });
  }
  return (
    <div>
      <ff-onboarding-widget />
    </div>
  );
}

export default SmartUiKyc;