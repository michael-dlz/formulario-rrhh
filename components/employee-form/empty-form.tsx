import React from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import { IconSvgElement, HugeiconsIcon } from '@hugeicons/react'
import { Button } from '../ui/button'
import { UserGroupIcon, Add01Icon } from '@hugeicons/core-free-icons'

interface EmptyFormProps {
    title: string
    description: string
    buttonText: string
    icon: IconSvgElement
    buttonAction: () => void
}

const EmptyForm = ({ title, description, buttonText, icon, buttonAction }: EmptyFormProps) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <HugeiconsIcon icon={UserGroupIcon} />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button type="button" variant="secondary" size="sm" onClick={buttonAction} >
                    <HugeiconsIcon icon={icon} />
                    {buttonText}
                </Button>
            </EmptyContent>
        </Empty>
    )
}

export default EmptyForm