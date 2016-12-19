import { APP_BASE_HREF } from '@angular/common';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent, AppModule } from '../../src/app';

describe('AppComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [ {
                provide: APP_BASE_HREF,
                useValue : '/'
            } ]
        });
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;

        expect(app).toBeTruthy();
    }));

});
