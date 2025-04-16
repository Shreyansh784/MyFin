import { Step, StepButton, Stepper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader.tsx';
import Box from '@mui/material/Box/Box';
import Paper from '@mui/material/Paper/Paper';
import Container from '@mui/material/Container/Container';
import SetupStep0 from './SetupStep0.tsx';
import SetupStep1 from './SetupStep1.tsx';
import SetupStep2 from './SetupStep2.tsx';
import SetupStep3 from './SetupStep3.tsx';
import { useNavigate } from 'react-router-dom';
import { ROUTE_AUTH } from '../../providers/RoutesProvider.tsx';
import { useAuthStatus } from '../../services/auth/authHooks.ts';
import { useLoading } from '../../providers/LoadingProvider.tsx';
import { CURRENCIES } from '../../consts/Currency.ts';

const Setup = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const loader = useLoading();
  const navigate = useNavigate();
  const authStatus = useAuthStatus(true);
  const steps = [
    t('setup.step0Label'),
    t('setup.step1Label'),
    t('setup.step2Label'),
    t('setup.step3Label'),
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, _setCompleted] = useState<{
    [k: number]: boolean;
  }>({});

  const [usernameValue, setUsername] = useState('');
  const [emailValue, setEmail] = useState('');
  const [currencyValue, setCurrency] = useState(CURRENCIES.EUR);

  const goToAuth = () => {
    navigate(ROUTE_AUTH);
  };

  useEffect(() => {
    if (!authStatus.isPending && !authStatus.needsSetup) {
      goToAuth();
    }
  }, [authStatus]);

  useEffect(() => {
    // Show loading indicator when isLoading is true
    if (authStatus.isPending) {
      loader.showLoading();
    } else {
      loader.hideLoading();
    }
  }, [authStatus.isPending]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SetupStep0
            onNext={(currency) => {
              setCurrency(currency);
              setCurrentStep(1);
            }}
          />
        );
      case 1:
        return (
          <SetupStep1
            onNext={(username, email) => {
              setUsername(username);
              setEmail(email);
              setCurrentStep(2);
            }}
          />
        );
      case 2:
        return (
          <SetupStep2
            username={usernameValue}
            email={emailValue}
            currency={currencyValue}
            onNext={() => setCurrentStep(3)}
          />
        );
      case 3:
        return <SetupStep3 onNext={() => goToAuth()} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Container maxWidth="xs">
        <Box
          p={3}
          mt={10}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <img
            src={
              theme.palette.mode === 'dark'
                ? '/res/logo_light_transparentbg.png'
                : '/res/logo_dark_transparentbg.png'
            }
            width="60%"
            style={{ marginBottom: 20 }}
          />
        </Box>
      </Container>
      <Paper
        elevation={0}
        sx={{ p: theme.spacing(2), m: theme.spacing(2), mt: 0 }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
        >
          <PageHeader
            title={t('setup.welcome')}
            subtitle={t('setup.welcomeStrapline')}
          />
        </Box>
        <Box sx={{ mt: theme.spacing(0), mb: theme.spacing(2) }}>
          <Stepper activeStep={currentStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={() => {}}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mt: theme.spacing(0), mb: theme.spacing(2) }}>
          {renderStepContent(currentStep)}
        </Box>
      </Paper>
    </Container>
  );
};

export default Setup;
