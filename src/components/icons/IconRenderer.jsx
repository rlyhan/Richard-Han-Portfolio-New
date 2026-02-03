import {
    ActivityIcon,
    BookIcon,
    CloudIcon,
    CodeIcon,
    FileIcon,
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
    file: FileIcon,
    pen: PenIcon,
    search: SearchIcon,
    server: ServerIcon,
    tool: ToolIcon,
    users: UsersIcon
};

const IconRenderer = ({ iconType = "default", className = "" }) => {
    const IconComponent = iconMapping[iconType] || iconMapping["default"];
    return <IconComponent className={className} />;
}

export default IconRenderer;