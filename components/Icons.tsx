
import React from 'react';
import { 
  HiSparkles, 
  HiCpuChip, // BrainCircuit alternative
  HiClipboard, 
  HiClipboardDocumentCheck, 
  HiBolt, 
  HiClock, 
  HiTrash, 
  HiCodeBracket, 
  HiBugAnt, 
  HiArrowPath, 
  HiDocumentText, 
  HiTableCells, 
  HiHashtag, 
  HiBeaker, 
  HiChevronDown, 
  HiPencilSquare, 
  HiCommandLine, 
  HiSquare2Stack, 
  HiBookmark, 
  HiXCircle, 
  HiCog6Tooth, 
  HiUserCircle, 
  HiIdentification, 
  HiArrowLeftOnRectangle, 
  HiArrowUturnLeft, 
  HiSun, 
  HiMoon, 
  HiComputerDesktop,
  HiPlus,
  HiDocumentPlus,
  HiClipboardDocumentList
} from 'react-icons/hi2';

export interface IconProps {
    className?: string;
}

// Wrapping react-icons to maintain the IconProps interface used throughout the app
// and to allow className overriding via Tailwind

export const SparklesIcon: React.FC<IconProps> = ({ className }) => <HiSparkles className={className} />;
export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => <HiCpuChip className={className} />;
export const ClipboardIcon: React.FC<IconProps> = ({ className }) => <HiClipboard className={className} />;
export const ClipboardCheckIcon: React.FC<IconProps> = ({ className }) => <HiClipboardDocumentCheck className={className} />;
export const BoltIcon: React.FC<IconProps> = ({ className }) => <HiBolt className={className} />;
export const HistoryIcon: React.FC<IconProps> = ({ className }) => <HiClock className={className} />;
export const TrashIcon: React.FC<IconProps> = ({ className }) => <HiTrash className={className} />;
export const CodeBracketIcon: React.FC<IconProps> = ({ className }) => <HiCodeBracket className={className} />;
export const BugAntIcon: React.FC<IconProps> = ({ className }) => <HiBugAnt className={className} />;
export const ArrowPathIcon: React.FC<IconProps> = ({ className }) => <HiArrowPath className={className} />;
export const DocumentTextIcon: React.FC<IconProps> = ({ className }) => <HiDocumentText className={className} />;
export const TableCellsIcon: React.FC<IconProps> = ({ className }) => <HiTableCells className={className} />;
export const HashtagIcon: React.FC<IconProps> = ({ className }) => <HiHashtag className={className} />;
export const BeakerIcon: React.FC<IconProps> = ({ className }) => <HiBeaker className={className} />;
export const ChevronDownIcon: React.FC<IconProps> = ({ className }) => <HiChevronDown className={className} />;
export const PencilSquareIcon: React.FC<IconProps> = ({ className }) => <HiPencilSquare className={className} />;
export const TerminalIcon: React.FC<IconProps> = ({ className }) => <HiCommandLine className={className} />;
export const Square2StackIcon: React.FC<IconProps> = ({ className }) => <HiSquare2Stack className={className} />;
// Reusing Sparkles for WandSparkles as it fits well, or could find a specific magic wand in other sets if strict adherence needed
export const WandSparklesIcon: React.FC<IconProps> = ({ className }) => <HiSparkles className={className} />; 
export const BookmarkIcon: React.FC<IconProps> = ({ className }) => <HiBookmark className={className} />;
export const XCircleIcon: React.FC<IconProps> = ({ className }) => <HiXCircle className={className} />;
export const Cog6ToothIcon: React.FC<IconProps> = ({ className }) => <HiCog6Tooth className={className} />;
export const UserCircleIcon: React.FC<IconProps> = ({ className }) => <HiUserCircle className={className} />;
export const IdentificationIcon: React.FC<IconProps> = ({ className }) => <HiIdentification className={className} />;
export const ArrowLeftOnRectangleIcon: React.FC<IconProps> = ({ className }) => <HiArrowLeftOnRectangle className={className} />;
export const ArrowUturnLeftIcon: React.FC<IconProps> = ({ className }) => <HiArrowUturnLeft className={className} />;
export const SunIcon: React.FC<IconProps> = ({ className }) => <HiSun className={className} />;
export const MoonIcon: React.FC<IconProps> = ({ className }) => <HiMoon className={className} />;
export const ComputerDesktopIcon: React.FC<IconProps> = ({ className }) => <HiComputerDesktop className={className} />;
export const PlusIcon: React.FC<IconProps> = ({ className }) => <HiPlus className={className} />;
export const DocumentPlusIcon: React.FC<IconProps> = ({ className }) => <HiDocumentPlus className={className} />;
export const SnippetIcon: React.FC<IconProps> = ({ className }) => <HiClipboardDocumentList className={className} />;
