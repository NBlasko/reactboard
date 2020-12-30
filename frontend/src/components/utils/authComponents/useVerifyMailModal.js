import { userSigned } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {useDispatch} from "react-redux"
import { AuthService } from "../../../api";
import { useModal } from "../ui/modal/useModal";

function useVerifyMailModal({ email, setBlockUnmounting }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [modal, setOpenModal] = useModal({
    title: "Email verification",
    buttonOneText: "Verify Email",
    onSubmitOne: ({ setOpen, inputValue }) => {
      setBlockUnmounting(true);
      AuthService.verifyMail({
        data: { email, accessCode: inputValue },
        onSuccess: response => {
          setOpen(false);
          localStorage.reactBoardToken = response.token;
          dispatch(userSigned(true));
          history.replace("./");
        },
        onError: error => {
          setBlockUnmounting(false);
          return error;
        }
      });
    },
    buttonTwoText: "Resend email",
    onSubmitTwo: () => {
      AuthService.resendVerificationMail({
        data: { email },
        onSuccess: () => {
          return "Success! An email has been sent.";
        },
        onError: error => {
          setBlockUnmounting(false);
          return error;
        }
      });
    },
    label: "Enter access code"
  });

  return [modal, setOpenModal];
}

export default useVerifyMailModal;
