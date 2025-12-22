import { useEffect, useState } from 'react'

export default function useObserveCssVariableChange(variableName: string) {
    const [property, setProperty] = useState(
        getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`)
    )

    useEffect(() => {
        const target = document.documentElement
        let available = true

        const observer = new MutationObserver(() => {
            if (available) {
                available = false

                requestAnimationFrame(() => {
                    const value = getComputedStyle(target).getPropertyValue(`--${variableName}`)
                    setProperty(value)
                    available = true
                })
            }
        })

        observer.observe(target, {
            attributes: true,
            attributeFilter: ['style']
        })

        return () => observer.disconnect()
    }, [variableName])

    return property
}
