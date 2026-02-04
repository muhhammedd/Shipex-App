export interface Address {
    id: string;
    merchantId: string;
    name: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    zone?: string;
    postalCode?: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAddressDto {
    name: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    zone?: string;
    postalCode?: string;
    country: string;
    isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> { }

export interface AddressListResponse {
    data: Address[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}
