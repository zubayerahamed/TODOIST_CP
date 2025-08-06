import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthHelper } from "../helpers/auth.helper";

@Injectable({providedIn: 'root'})
export class AuthGuard{

    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const currentUser = sessionStorage.getItem("currentUser");
        
        if (AuthHelper.isAuthenticated()) {
            return true;
        }

        this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url },
        });

        return false;
    }
}