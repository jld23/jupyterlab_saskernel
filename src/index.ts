import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  JSONExt // new
} from '@phosphor/coreutils';

import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';

import '../style/index.css';


/**
 * A widget to show the SAS log.
 */
class SASlogWidget extends Widget {
  /**
   * Construct a new SASlog widget.
   */
  constructor() {
    super();

    this.id = 'sas_kernel-jupyterlab';
    this.title.label = 'SAS Log';
    this.title.closable = true;
    this.addClass('jp-SASlogWidget');

    this.img = document.createElement('img');
    /*this. */
    this.img.className = 'jp-xkcdCartoon';
    this.node.appendChild(this.img);

    this.img.insertAdjacentHTML('afterend',
      `<div class="jp-xkcdAttribution">
        <a href="https://creativecommons.org/licenses/by-nc/2.5/" class="jp-xkcdAttribution" target="_blank">
          <img src="https://licensebuttons.net/l/by-nc/2.5/80x15.png" />
        </a>
      </div>`
    );
  }

  /**
   * The image element associated with the widget.
   */
  readonly img: HTMLImageElement;

  /**
   * Handle update requests for the widget.
   */
  onUpdateRequest(msg: Message): void {
    fetch('https://egszlpbmle.execute-api.us-east-1.amazonaws.com/prod').then(response => {
      return response.json();
    }).then(data => {
      this.img.src = data.img;
      this.img.alt = data.title;
      this.img.title = data.alt;
    });
  }
};


/**
 * Activate the xckd widget extension.
 */
function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension jupyterlab_saslog is activated!');

  // Declare a widget variable
  let widget: SASlogWidget;

  // Add an application command
  const command: string = 'saslog:open';
  app.commands.addCommand(command, {
    label: 'Show SAS Log',
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        widget = new SASlogWidget();
        widget.update();
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main area if it's not there
        app.shell.addToMainArea(widget);
      } else {
        // Refresh the comic in the widget
        widget.update();
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
  let tracker = new InstanceTracker<Widget>({ namespace: 'saslog' });
  restorer.restore(tracker, {
    command,
    args: () => JSONExt.emptyObject,
    name: () => 'saslog'
  });
};

/**
 * Initialization data for the jupyterlab_saslog extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_saslog',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
