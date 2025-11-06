import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { AuthCustomerDto } from "src/customer/DTO/customer.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.["access_token"]; //Extract JWT from cookies
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: "725dTU2NGU",
        });
    }

    async validate(payload: AuthCustomerDto): Promise<AuthCustomerDto> {
        return { id: payload.id, name: payload.name, last_name: payload.last_name, email: payload.email, is_guest: payload.is_guest };
    }
}