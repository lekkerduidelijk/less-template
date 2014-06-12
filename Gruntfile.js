module.exports = function(grunt) {

  // Grunt task timer
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n * <%= pkg.name %>\n * @author: <%= pkg.author %>\n * @date: <%= grunt.template.today("yyyy-mm-dd") %>\n */',
    usebanner: {
      production: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },
        files: {
          src: [
            'build/js/all.js',
            'build/css/style.css',
            'build/css/style.cleaned.css'
          ]
        }
      }
    },

    copy: {
      build: {
        cwd: 'source',
        src: [
          '**',
          '!**/*.less',
          // '!**/*.html',
          '!**/css/**',
        ],
        dest: 'build',
        expand: true
      },
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      scripts: {
        src: [
          'build/js/**/*.js',
          'build/js/vendor/**',
          '!build/js/all.full.js',
          '!build/js/all.js',
          '!build/js/oldbrowsers.js'
        ]
      }
    },

    less: {
      build: {
        options: {
          paths: ["source/css"],
          dumpLineNumbers: 'comments',
          compress: false
        },
        files: [{
          src:  'source/css/style.less',
          dest: 'build/css/style.full.css'
        }]
      }
    },

    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },

    cssmin: {
      build: {
        files: {
          'build/css/style.css': [ 'build/css/style.full.css' ],
          'build/css/style.cleaned.css': [ 'build/css/style.cleaned.full.css' ]
        }
      }
    },

    uncss: {
      build: {
        src: ['build/**/*.html'],
        dest: 'build/css/style.cleaned.full.css',
        options: {
          ignore: [
            '.collapsing', // collapsing
            /\.fade/, // fade
            /\.close/, // .close class
            /\.collapse/, // .collapse prefixed classes
            /\.modal/, // .modal prefixed classes
            /\.js\-/, // .js- prefixed classes
            /\.is\-/, // .is- prefixed classes
          ],
          htmlroot: 'build',
          stylesheets: ['style.full.css'],
          csspath: 'css/',
          report: 'min',
        }
      }
    },

    concat: {
      base: {
        src: [
          'bower_components/jquery/jquery.js',
          'bower_components/modernizr/modernizr.js',
          // Add more libraries here
          // 'bower_components/...',

          'source/js/plugins.js',
          'source/js/main.js',
        ],
        dest: 'build/js/all.full.js',
      },
      oldbrowsers: {
        src: [
          'bower_components/html5shiv/dist/html5shiv.js',
          'bower_components/respond/dest/respond.min.js'
        ],
        dest: 'build/js/oldbrowsers.js'
      }
    },

    uglify: {
      build: {
        options: {
          report: 'min'
        },
        files: {
          'build/js/all.js': [ 'build/js/all.full.js' ],
          'build/js/oldbrowsers.js': [ 'build/js/oldbrowsers.js' ]
        }
      }
    },

    imagemin: {
      build: {
        files: [{
          expand: true,
          cwd: 'source/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'build/img/'
        }]
      }
    },

    svgmin: {
      options: {
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ]
      },
      build: {
        files: [{
          expand: true,
          cwd: 'source/img',
          src: ['**/*.svg'],
          dest: 'build/img/'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['source/**/*.js'],
        tasks: ['scripts'],
      },
      stylesheets: {
        files: ['source/**/*.less'], //, 'source/**/module/*.less', 'source/**/layout/*.less'],
        tasks: ['stylesheets'],
      },
      copy: {
        files: [
          'source/**',
          '!source/**/*.js',
          '!source/**/*.less'
        ],
        tasks: ['copy']
      },
      livereload: {
        files: ['build/css/*.css'],
        options: { livereload: true }
      }
    },

    connect: {
      server: {
        options: {
          port: 4000,
          base: 'build',
          hostname: '*'
        }
      }
    },

    notify: {
      stylesheets: {
        options: {
          message: "Stylesheets: done!"
        }
      },
      scripts: {
        options: {
          message: "Scripts: done!"
        }
      },
      media: {
        options: {
          message: "Media: done!"
        }
      },
      build: {
        options: {
          message: "Build: done!"
        }
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-uncss');

  // Default task(s).
  // grunt.registerTask('default', ['watch']);
  // grunt.registerTask('build', ['concat', 'uglify', 'less:production', 'usebanner', 'imagemin']);

  grunt.registerTask(
    'default',
    'Watches the project for changes, automatically builds them and runs a server.',
    [ 'build', 'connect', 'watch' ]
  );


  grunt.registerTask(
    'stylesheets',
    'Compile all stylesheets',
    [
      'less',
      'autoprefixer',
      'uncss',
      'cssmin',
      'notify:stylesheets'
    ]
  );

  grunt.registerTask(
    'scripts',
    'Compile all javascripts',
    [
      'concat',
      'uglify',
      'clean:scripts',
      'notify:scripts'
    ]
  );

  grunt.registerTask(
    'media',
    'Minify all media images and SVG',
    [
      'imagemin',
      'svgmin',
      // 'grunticon',
      'clean:media',
      'notify:media'
    ]
  );

  grunt.registerTask(
    'build',
    'Compile all assets from source into build',
    [
      'clean:build',
      'copy',
      'stylesheets',
      'scripts',
      // 'media',
      'usebanner',
      'notify:build'
    ]
  );


};
