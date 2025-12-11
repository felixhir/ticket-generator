import { BackgroundPattern } from '../contexts/DesignContext'

export default function getPatternClass(pattern: BackgroundPattern) {
    switch (pattern) {
        case BackgroundPattern.Lines:
            return 'bg-lines'
        case BackgroundPattern.Blocks:
            return 'bg-blocks'
        case BackgroundPattern.Hearts:
            return 'bg-hearts'
        case BackgroundPattern.Waves:
            return 'bg-waves'
    }
}
