import {
    Step,
    StepIcon,
    StepIndicator,
    StepSeparator,
    StepStatus,
    Stepper,
    useSteps,
    Text,
    Stack,
} from '@chakra-ui/react';
import { useDonateProject } from '../../../storage';
import { useEffect } from 'react';

const steps = [
    { title: 'First', description: 'Approve Spender Contract' },
    { title: 'Second', description: 'Donate to Project' },
]

export default function StepperEvent() {
    const { index } = useDonateProject()

    const { activeStep, setActiveStep } = useSteps({
        index: index,
        count: steps.length,
    })

    useEffect(() => {
        setActiveStep(index)
    }, [index])


    const activeStepText = steps[activeStep].description

    return (
        <Stack mt={2}>
            <Stepper colorScheme='green' size='sm' index={activeStep} gap='0'>
                {steps.map((step, index) => (
                    <Step key={index} >
                        <StepIndicator>
                            <StepStatus complete={<StepIcon />} />
                        </StepIndicator>
                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>
            <Text fontSize={'xs'}>
                Step {activeStep + 1}: <b>{activeStepText}</b>
            </Text>
        </Stack>
    )
}