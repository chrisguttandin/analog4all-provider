import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../../src/app/app.component';
import { AppModule } from '../../src/app/app.module';
import { StoreModule } from '../../src/app/store';

describe('AppComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                RouterTestingModule
            ],
            providers: [
                // Replace the StoreModule because it would otherwise dispatch events right away.
                { provide: StoreModule, useValue: null }
            ]
        });
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;

        expect(app).toBeTruthy();
    });

});
