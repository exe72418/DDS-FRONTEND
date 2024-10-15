
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CustomComponentsModule } from './app/modules/custom-components.module';



platformBrowserDynamic().bootstrapModule(CustomComponentsModule)
  .catch(err => console.error(err));
