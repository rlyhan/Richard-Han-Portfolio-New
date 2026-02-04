import PageSection from "./layout/PageSection"
import SectionHeading from "./common/SectionHeading"
import LinkButton from "./common/Buttons/LinkButton"

const Contact = () => {
    return (
        <PageSection id="contact" additionalClasses="flex items-center justify-center min-h-[85vh]">
            <div className="w-full h-full sm:min-w-xl mx-auto text-center">
                <SectionHeading label="Contact" />
                <div className="my-12 md:mt-16 md:mb-24">
                    <img src="/images/portrait.png" alt="Portrait of Richard Han" className="w-24 h-24 md:w-42 md:h-42 rounded-full object-cover mx-auto mb-12 md:mb-16" />
                    <p className="text-grey-500 text-2xl md:text-4xl">
                        Let's connect!
                    </p>
                    <p className="text-grey-500 text-2xl md:text-4xl mt-6">
                        I'm open to new opportunities or a chat.&nbsp;
                        <a href="/Richard_Han_CV_2026.pdf" download className="text-yellow-500 hover:text-yellow-500/50">
                            Download my CV here.
                        </a>
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center">
                    <LinkButton
                        href="mailto:richard.ly.han@gmail.com"
                        label="Email"
                        size="large"
                    />
                    <LinkButton href="https://github.com/rlyhan" label="GitHub" customIcon="github" theme="solid-fill" size="large" />
                    <LinkButton href="https://www.linkedin.com/in/richard-ly-han/" label="LinkedIn" customIcon="linkedin" theme="solid-fill" size="large" />
                </div>
            </div>
        </PageSection>
    )
}

export default Contact