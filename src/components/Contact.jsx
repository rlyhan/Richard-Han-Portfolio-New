import PageSection from "./layout/PageSection"
import SectionHeading from "./common/SectionHeading"
import LinkButton from "./common/Buttons/LinkButton"

const Contact = () => {
    return (
        <PageSection id="contact" additionalClasses="flex items-center justify-center min-h-[85vh]">
            <div className="w-full h-full sm:min-w-xl mx-auto text-center">
                <SectionHeading label="Contact" />
                <div className="my-24">
                    <p className="text-sky-500 text-4xl">
                        Let's connect!
                    </p>
                    <p className="text-grey-500 text-4xl mt-6">
                        I'm open to new opportunities or a chat.&nbsp;
                        <a href="/Richard_Han_CV_2026.pdf" download className="text-yellow-500 hover:text-yellow-500/50">
                            Download my CV here.
                        </a>
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 justify-center space-x-4">
                    <LinkButton
                        href="mailto:richard.ly.han@gmail.com"
                        label="Email"
                        size="large"
                    />
                    <LinkButton href="https://github.com/richardlyhan" label="GitHub" customIcon="github" theme="solid-fill" size="large" />
                    <LinkButton href="https://linkedin.com/in/richardlyhan" label="LinkedIn" customIcon="linkedin" theme="solid-fill" size="large" />
                </div>
            </div>
        </PageSection>
    )
}

export default Contact