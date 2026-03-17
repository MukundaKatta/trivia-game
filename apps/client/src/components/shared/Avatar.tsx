interface Props {
  username: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  isConnected?: boolean;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function Avatar({ username, color, size = 'md', isConnected = true }: Props) {
  const initial = username.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold
                  ${isConnected ? '' : 'opacity-40'} transition-opacity`}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}
