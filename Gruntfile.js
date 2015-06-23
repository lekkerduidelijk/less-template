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
            'build/assets/js/all.js',
            'build/assets/css/style.css',
            'build/assets/css/style.cleaned.css'
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
          'build/assets/js/**/*.js',
          'build/assets/js/vendor/**',
          '!build/assets/js/all.full.js',
          '!build/assets/js/all.js',
          '!build/assets/js/oldbrowsers.js'
        ]
      }
    },

    less: {
      build: {
        options: {
          paths: ["source/assets/css"],
          dumpLineNumbers: 'comments',
          compress: false
        },
        files: [{
          src:  'source/assets/css/style.less',
          dest: 'build/assets/css/style.full.css'
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
          'build/assets/css/style.css': [ 'build/assets/css/style.full.css' ],
          'build/assets/css/style.cleaned.css': [ 'build/assets/css/style.cleaned.full.css' ]
        }
      }
    },

    uncss: {
      build: {
        src: ['build/**/*.html'],
        dest: 'build/assets/css/style.cleaned.full.css',
        options: {
          ignore: [
            /\.collapsing/,
            /\.fade/,
            /\.close/,
            /\.collapse/,
            /\.modal/,
            /\.js\-/,
            /\.is\-/,
            /\.has\-/,
            /\.no\-/,
            /\.affix/,
            /\-webkit\-/,
            /\-moz\-/,
          ],
          htmlroot: 'build',
          stylesheets: ['style.full.css'],
          csspath: 'assets/css/',
          report: 'min',
        }
      }
    },

    concat: {
      base: {
        src: [
          'bower_components/jquery/dist/jquery.js',

          // Add more libraries here
          // 'bower_components/...',

          'source/assets/js/main.js',
        ],
        dest: 'build/assets/js/all.full.js',
      }
    },

    uglify: {
      build: {
        options: {
          report: 'min'
        },
        files: {
          'build/assets/js/all.js': [ 'build/assets/js/all.full.js' ]
        }
      }
    },

    imagemin: {
      build: {
        files: [{
          expand: true,
          cwd: 'source/assets/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'build/assets/img/'
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
          cwd: 'source/assets/img',
          src: ['**/*.svg'],
          dest: 'build/assets/img/'
        }]
      }
    },

    watch: {
      scripts: {
        files: ['source/assets/**/*.js'],
        tasks: ['scripts'],
      },
      stylesheets: {
        files: ['source/assets/**/*.less'],
        tasks: ['stylesheets'],
      },
      copy: {
        files: [
          'source/**',
          '!source/assets/**/*.js',
          '!source/assets/**/*.less'
        ],
        tasks: ['copy']
      },
      livereload: {
        files: ['build/assets/css/*.css'],
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
      // 'clean:media',
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
      'media',
      'usebanner',
      'notify:build'
    ]
  );


};
