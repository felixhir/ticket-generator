import CSSVariableColorPicker from './CSSVariableColorPicker'
import CSSVariablePixelInput from './CSSVariablePixelInput'
import TicketBackground from './TicketBackground'

function StylingGroup({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <div className='space-y-6'>
            <h3 className='text-sm font-semibold text-gray-200 border-b border-gray-700 pb-1'>{title}</h3>
            <div className='space-y-4'>{children}</div>
        </div>
    )
}

export default function SidebarStylingSection() {
    return (
        <div className='space-y-12'>
            {/* Background Section */}
            <StylingGroup title='Background'>
                <TicketBackground />
            </StylingGroup>

            {/* Dimensions Section */}
            <StylingGroup title='Dimensions'>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariablePixelInput variable='--ticket-width' label='Width' min={200} max={1200} />
                    <CSSVariablePixelInput variable='--ticket-height' label='Height' min={100} max={600} />
                </div>
            </StylingGroup>

            {/* Header Section */}
            <StylingGroup title='Header'>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariableColorPicker variable='--ticket-header-bg' label='Background Color' />
                    <CSSVariableColorPicker variable='--ticket-header-text' label='Text Color' />
                </div>
                <CSSVariablePixelInput variable='--ticket-header-height' label='Height' min={20} max={100} />
            </StylingGroup>

            {/* Typography Section */}
            <StylingGroup title='Typography'>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariableColorPicker variable='--ticket-text' label='Primary Text Color' />
                    <CSSVariableColorPicker variable='--ticket-text-alt' label='Alt Text Color' />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariablePixelInput variable='--ticket-font-size' label='Font Size' min={8} max={24} />
                    <CSSVariablePixelInput
                        variable='--ticket-font-size-large'
                        label='Large Font Size'
                        min={12}
                        max={32}
                    />
                </div>
                <CSSVariablePixelInput variable='--ticket-font-size-small' label='Small Font Size' min={6} max={16} />
            </StylingGroup>

            {/* Spacing Section */}
            <StylingGroup title='Spacing'>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariablePixelInput variable='--ticket-padding' label='Outer Padding' min={0} max={50} />
                    <CSSVariablePixelInput
                        variable='--ticket-padding-content'
                        label='Content Padding'
                        min={0}
                        max={50}
                    />
                </div>
                <CSSVariablePixelInput variable='--ticket-padding-inner' label='Inner Padding' min={0} max={25} />
            </StylingGroup>

            {/* Barcode Section */}
            <StylingGroup title='Barcode'>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariableColorPicker variable='--ticket-barcode-color' label='Color' />
                    <CSSVariableColorPicker variable='--ticket-barcode-bg' label='Background' />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariablePixelInput variable='--ticket-barcode-width' label='Width' min={50} max={300} />
                    <CSSVariablePixelInput variable='--ticket-barcode-height' label='Height' min={20} max={100} />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                    <CSSVariablePixelInput
                        variable='--ticket-barcode-max-width'
                        label='Max Width'
                        min={100}
                        max={400}
                    />
                    <CSSVariablePixelInput variable='--ticket-barcode-text-size' label='Text Size' min={8} max={20} />
                </div>
            </StylingGroup>
        </div>
    )
}
