import { useRef } from "react"
import PageSection from "../components/layout/PageSection"
import SectionHeading from "../components/common/SectionHeading"
import LinkButton from "../components/common/Buttons/LinkButton"
import { useLetterHop } from "../hooks/useLetterHop"

// The Contact page, and the end of the chain: nothing is staged below it, and nothing
// takes the scroll off the viewer here.
const ContactPage = () => {
    const inviteRef = useRef(null)

    useLetterHop(inviteRef)

    // min-h-svh, not 85% of a viewport: as the last page it has to be tall enough that
    // the document can still scroll it up to its resting place, where the handoff from
    // Projects lands it. Short of that the maximum scroll arrives first and Contact never
    // reaches the top of the viewport.
    //
    // bg-carbon-900 for the same reason Projects states its own: staged below the page
    // that hands over to it, the body is carrying that page's ground, not this one's.
    return (
        <PageSection id="contact" additionalClasses="flex items-center justify-center min-h-svh bg-carbon-900">
            <div className="w-full h-full sm:min-w-xl mx-auto text-center">
                <SectionHeading label="Contact" />
                <div className="my-12 md:mt-16 md:mb-24">
                    <img src="/images/portrait.png" alt="Portrait of Richard Han" className="w-24 h-24 md:w-42 md:h-42 rounded-full object-cover mx-auto mb-12 md:mb-16" />
                    <p ref={inviteRef} className="text-neon text-2xl md:text-4xl">
                        Let's connect!
                    </p>
                    <p className="text-paper text-2xl md:text-4xl mt-6">
                        I'm open to new opportunities or a chat.&nbsp;
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center">
                    <LinkButton
                        href="mailto:richard.ly.han@gmail.com"
                        label="Email"
                        size="large"
                    />
                    <LinkButton href="https://github.com/rlyhan" label="GitHub" customIcon="github" size="large" />
                    <LinkButton href="https://www.linkedin.com/in/richard-ly-han/" label="LinkedIn" customIcon="linkedin" size="large" />
                </div>
            </div>
        </PageSection>
    )
}

export default ContactPage