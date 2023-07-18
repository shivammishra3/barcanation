import { useParams } from 'react-router-dom';
import OTP from './otp';

function YourComponent() {
  const { email } = useParams();

  const handleOTPVerificationSuccess = () => {
    // Handle the success action, e.g., redirect the user
  };

  return <OTP email={email} onSuccess={handleOTPVerificationSuccess} />;
}

export default YourComponent;
