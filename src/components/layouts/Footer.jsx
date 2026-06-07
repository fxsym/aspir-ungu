import React from 'react';
import OrganizationLogo from '../ui/OrganizationLogo';
import Text from '../ui/typography/Text';

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border py-12 px-4 md:px-16 lg:px-20">
            <div className="flex flex-col items-center gap-8">
                <OrganizationLogo />
                <div className="text-center flex flex-col gap-2">
                    <Text className="text-muted font-medium">
                        Jl. Letjen Pol. Soemarto No.127, Watumas, Purwokerto
                    </Text>
                    <Text className="text-muted/60 text-sm">
                        © {new Date().getFullYear()} Aspir Ungu. All rights reserved.
                    </Text>
                </div>
            </div>
        </footer>
    );
}
