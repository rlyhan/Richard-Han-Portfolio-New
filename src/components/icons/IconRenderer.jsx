import {
    ActivityIcon,
    BookIcon,
    Chart,
    ChefHatIcon,
    ClapperboardIcon,
    CloudIcon,
    CodeIcon,
    ExternalLinkIcon,
    FileIcon,
    GamepadIcon,
    GitHubIcon,
    LanguagesIcon,
    LinkedInIcon,
    MountainIcon,
    MusicIcon,
    PenIcon,
    RobotIcon,
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
    chart: Chart,
    chefHat: ChefHatIcon,
    cinema: ClapperboardIcon,
    cloud: CloudIcon,
    code: CodeIcon,
    externalLink: ExternalLinkIcon,
    file: FileIcon,
    gamepad: GamepadIcon,
    github: GitHubIcon,
    languages: LanguagesIcon,
    linkedin: LinkedInIcon,
    mountain: MountainIcon,
    music: MusicIcon,
    pen: PenIcon,
    robot: RobotIcon,
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