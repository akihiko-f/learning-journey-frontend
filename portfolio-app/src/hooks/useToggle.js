import { useState } from "react";

function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue)

    const toggle = (newValue) => {
        if (typeof newValue === 'boolean') {
            setValue(newValue)
        } else {
            setValue(prev => !prev)
        }
    }

    return [value, toggle]
}

export default useToggle