'use client';
import Image from 'next/image';

const WalletAvatar = ({ address}: { address: string }) => {
  return <Image src={`https://effigy.im/a/${address}.png`} height={24} width={24} alt={address} className="rounded-full ring-standard" />;
};
export default WalletAvatar;
