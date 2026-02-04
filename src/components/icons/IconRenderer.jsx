import {
    ActivityIcon,
    BookIcon,
    CloudIcon,
    CodeIcon,
    ExternalLinkIcon,
    FileIcon,
    GitHubIcon,
    LinkedInIcon,
    PenIcon,
    SearchIcon,
    ServerIcon,
    ToolIcon,
    TickIcon,
    UsersIcon
} from "./index";

const iconMapping = {
    default: TickIcon,
    activity: ActivityIcon,
    book: BookIcon,
    cloud: CloudIcon,
    code: CodeIcon,
    externalLink: ExternalLinkIcon,
    file: FileIcon,
    github: GitHubIcon,
    linkedin: LinkedInIcon,
    pen: PenIcon,
    search: SearchIcon,
    server: ServerIcon,
    tool: ToolIcon,
    users: UsersIcon
};

const IconRenderer = ({ icon = "default", className = "" }) => {
    const IconComponent = iconMapping[icon] || iconMapping["default"];
    return <IconComponent className={className} />;
}

export default IconRenderer;